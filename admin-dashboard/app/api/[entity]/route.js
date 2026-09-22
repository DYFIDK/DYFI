import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import {
  getFirestoreDocuments,
  saveFirestoreDocument,
  deleteFirestoreDocument,
} from "@/lib/firestore";

const ALLOWED_ENTITIES = new Set([
  "campaigns",
  "news",
  "committee",
  "gallery",
  "activities",
  "announcements",
  "donors",
  "members",
]);

// Determine local JSON file path: check root public first, fallback to admin public
const getFilePath = (entity) => {
  const rootPublicPath = path.resolve(process.cwd(), "..", "public", `${entity}.json`);
  if (fs.existsSync(rootPublicPath)) {
    return rootPublicPath;
  }
  const localPublicPath = path.join(process.cwd(), "public", `${entity}.json`);
  return localPublicPath;
};

// Default initial mock data for each entity
const defaultData = {
  campaigns: [
    { id: "1", title: "Regional Job Rights Initiative", date: "2025-08-15", status: "Published", description: "Demanding fair employment opportunities for local Dakshina Kannada youth in regional public sectors, Mangaluru Port, and industrial zones.", image: "/images/hero-banner-1.jpg" },
    { id: "2", title: "Harmony & Unity Campaign", date: "2025-07-20", status: "Published", description: "Promoting communal harmony, secularism, and friendly bonds among youth across coastal towns to counter divisive narratives.", image: "/images/hero-banner-3.jpg" },
    { id: "3", title: "Anti-Drug Campus Crusade", date: "2025-06-10", status: "Draft", description: "Launching awareness campaigns in district colleges and student hubs to combat substance abuse and foster healthy lifestyles.", image: "/images/hero-banner-2.jpg" },
  ],
  news: [
    { id: "1", title: "DYFI Launches Youth Employment Survey", date: "2025-08-18", views: 245, content: "A regional survey to map employment needs and skill sets of coastal youth, covering Ullal, Mangaluru, Bantwal, and Belthangady.", image: "/images/hero-banner-1.jpg" },
    { id: "2", title: "Mangaluru Peace March Promotes Unity", date: "2025-08-10", views: 189, content: "Hundreds of youth joined the unity rally to build solidarity, peace, and mutual respect among different coastal communities.", image: "/images/hero-banner-2.jpg" },
    { id: "3", title: "District Volunteers Active in Coastal Cleanups", date: "2025-07-28", views: 132, content: "DYFI youth wings organized successful plastic cleanups and environmental awareness drives at popular coastal beaches in DK.", image: "/images/hero-banner-3.jpg" }
  ],
  committee: [
    { id: "1", role: "District President", name: "Comrade Naveen", area: "DYFI Dakshina Kannada" },
    { id: "2", role: "District Secretary", name: "Comrade Santosh", area: "DYFI Dakshina Kannada" },
    { id: "3", role: "District Vice President", name: "Comrade Vinod", area: "DYFI Dakshina Kannada" }
  ],
  gallery: [
    { id: "1", alt: "Rally Support", src: "/images/hero-banner-1.jpg" },
    { id: "2", alt: "Anti-Drug March", src: "/images/hero-banner-2.jpg" },
    { id: "3", alt: "Sports Meet", src: "/images/hero-banner-3.jpg" }
  ],
  activities: [
    { id: "1", title: "Coastal Harmony Youth Meet", date: "2025-08-01", description: "Mangaluru city hosted a regional youth meetup focusing on promoting peace and friendly cultural exchanges.", image: "/images/hero-banner-2.jpg" },
    { id: "2", title: "Monsoon Distress Support", date: "2025-07-15", description: "DYFI teams provided voluntary cleanup and flood rehabilitation services to affected coastal communities in Ullal.", image: "/images/hero-banner-1.jpg" }
  ],
  donors: [
    { id: "1", name: "Arjun Rao", phone: "9876543210", group: "O+", area: "Ullal" },
    { id: "2", name: "Prerna Amin", phone: "9448123450", group: "B+", area: "Mangaluru City" }
  ],
  members: [
    { id: "DK-2025-781290", name: "Mohammad Harris", phone: "9008123456", area: "Bantwal", type: "Youth", date: "2026-08-24" }
  ],
  announcements: [
    { id: "1", type: "CIRCULAR", title: "Taluk Assembly Review Report", content: "All Local Unit committees must submit their youth survey reports to the respective taluk centers by September 5, 2026.", date: "August 25, 2026" }
  ]
};

const getLocalJSONData = (entity) => {
  const filePath = getFilePath(entity);
  try {
    if (!fs.existsSync(filePath)) {
      const defaults = defaultData[entity] || [];
      fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2));
      return defaults;
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return defaultData[entity] || [];
  }
};

const saveLocalJSONData = (entity, updatedData) => {
  try {
    const filePath = getFilePath(entity);
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
  } catch (err) {
    console.error("Local JSON save failed:", err);
  }
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request, { params }) {
  const { entity } = await params;

  if (!ALLOWED_ENTITIES.has(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400, headers: corsHeaders });
  }

  // 1. PRIMARY: Query Firebase Firestore database
  const firestoreRes = await getFirestoreDocuments(entity);
  if (firestoreRes.success && firestoreRes.data && firestoreRes.data.length > 0) {
    return NextResponse.json(firestoreRes.data, { headers: corsHeaders });
  }

  // 2. FALLBACK: Read local JSON files
  const localData = getLocalJSONData(entity);
  return NextResponse.json(localData, { headers: corsHeaders });
}

export async function POST(request, { params }) {
  try {
    const { entity } = await params;

    if (!ALLOWED_ENTITIES.has(entity)) {
      return NextResponse.json({ error: "Invalid entity" }, { status: 400, headers: corsHeaders });
    }

    const body = await request.json();
    const newEntry = { id: body.id ? String(body.id) : String(Date.now()), ...body };

    // 1. PRIMARY: Save to Firebase Firestore database
    let savedToFirestore = false;
    const firestoreRes = await saveFirestoreDocument(entity, newEntry.id, newEntry);
    if (firestoreRes.success) {
      savedToFirestore = true;
    } else {
      console.warn(`Firestore save failed for ${entity}, saved to local storage:`, firestoreRes.error);
    }

    // 2. ALWAYS SYNC TO LOCAL JSON BACKUP
    const currentData = getLocalJSONData(entity);
    const updatedData = [
      newEntry,
      ...currentData.filter((item) => String(item.id) !== String(newEntry.id)),
    ];
    saveLocalJSONData(entity, updatedData);

    return NextResponse.json(
      { success: true, data: newEntry, firestore: savedToFirestore },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST entity error in admin:", error);
    return NextResponse.json({ success: false, error: "Failed to save entry" }, { status: 500, headers: corsHeaders });
  }
}

// Helper to remove Cloudinary image on delete
const deleteCloudinaryImage = async (imageUrl) => {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").toLowerCase().trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();
  if (!imageUrl || !cloudName || !apiKey || !apiSecret) return;

  if (!imageUrl.includes(`res.cloudinary.com/${cloudName}`)) return;

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length < 2) return;
    const publicId = urlParts[1].replace(/^v\d+\//, "").replace(/\.[^.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary image deleted: ${publicId}`);
  } catch (err) {
    console.warn("Cloudinary delete failed (non-critical):", err.message);
  }
};

export async function DELETE(request, { params }) {
  try {
    const { entity } = await params;

    if (!ALLOWED_ENTITIES.has(entity)) {
      return NextResponse.json({ error: "Invalid entity" }, { status: 400, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing entity ID query param" }, { status: 400, headers: corsHeaders });
    }

    // Clean up Cloudinary image if present
    const localData = getLocalJSONData(entity);
    const itemToDelete = localData.find((item) => String(item.id) === String(id));
    const imageUrl = itemToDelete?.image || itemToDelete?.src || null;
    if (imageUrl) {
      await deleteCloudinaryImage(imageUrl);
    }

    // 1. PRIMARY: Delete from Firebase Firestore database
    await deleteFirestoreDocument(entity, id);

    // 2. ALWAYS SYNC TO LOCAL JSON BACKUP
    const updatedData = localData.filter((item) => String(item.id) !== String(id));
    saveLocalJSONData(entity, updatedData);

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("DELETE entity error in admin:", error);
    return NextResponse.json({ success: false, error: "Failed to delete entry" }, { status: 500, headers: corsHeaders });
  }
}
