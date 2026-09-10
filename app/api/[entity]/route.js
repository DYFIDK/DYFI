import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && (supabaseServiceRole || supabaseAnonKey))
  ? createClient(supabaseUrl, supabaseServiceRole || supabaseAnonKey, {
      auth: { persistSession: false }
    })
  : null;

// Firebase REST Base URL
const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL ? process.env.FIREBASE_DATABASE_URL.replace(/\/$/, "") : null;

const getFilePath = (entity) => {
  return path.join(process.cwd(), "public", `${entity}.json`);
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
    return [];
  }
};

const saveLocalJSONData = (entity, updatedData) => {
  try {
    fs.writeFileSync(getFilePath(entity), JSON.stringify(updatedData, null, 2));
  } catch (err) {
    console.error("Local save failed:", err);
  }
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}

export async function GET(request, { params }) {
  const { entity } = await params;

  // 1. SUPABASE ROUTING (Postgres users, members, donors)
  if (supabase && (entity === "members" || entity === "donors")) {
    try {
      const { data, error } = await supabase.from(entity).select("*");
      if (error) throw error;
      return NextResponse.json(data || [], { headers });
    } catch (err) {
      console.warn(`Supabase GET ${entity} failed, falling back to local storage:`, err.message);
    }
  }

  // 2. FIREBASE ROUTING (public dynamic contents)
  if (firebaseDbUrl && entity !== "members" && entity !== "donors") {
    try {
      const res = await fetch(`${firebaseDbUrl}/${entity}.json`);
      if (res.ok) {
        const raw = await res.json();
        if (!raw) return NextResponse.json([], { headers });
        const list = Object.entries(raw).map(([key, val]) => ({
          ...val,
          id: val.id || key
        }));
        return NextResponse.json(list, { headers });
      }
    } catch (err) {
      console.warn(`Firebase GET ${entity} failed, falling back to local storage:`, err.message);
    }
  }

  // 3. FALLBACK TO LOCAL JSON FILES
  const data = getLocalJSONData(entity);
  return NextResponse.json(data, { headers });
}

export async function POST(request, { params }) {
  try {
    const { entity } = await params;
    const body = await request.json();
    const newEntry = { id: body.id || String(Date.now()), ...body };

    let savedToRemote = false;

    // 1. SUPABASE ROUTING (Postgres users, members, donors)
    if (supabase && (entity === "members" || entity === "donors")) {
      try {
        const { data, error } = await supabase.from(entity).upsert([newEntry]).select();
        if (error) throw error;
        savedToRemote = true;
      } catch (err) {
        console.warn(`Supabase POST ${entity} failed:`, err.message);
      }
    }

    // 2. FIREBASE ROUTING (public dynamic contents)
    if (firebaseDbUrl && entity !== "members" && entity !== "donors") {
      try {
        const res = await fetch(`${firebaseDbUrl}/${entity}/${newEntry.id}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry)
        });
        if (res.ok) {
          savedToRemote = true;
        }
      } catch (err) {
        console.warn(`Firebase POST ${entity} failed:`, err.message);
      }
    }

    // 3. ALWAYS SYNC TO LOCAL JSON FILES (keeps local backup in sync)
    const data = getLocalJSONData(entity);
    const updatedData = [newEntry, ...data.filter(item => String(item.id) !== String(newEntry.id))];
    saveLocalJSONData(entity, updatedData);

    return NextResponse.json({ success: true, data: newEntry }, { headers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers });
  }
}

// Delete a Cloudinary image by its URL
const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return;

  // Only process Cloudinary URLs
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!imageUrl.includes(`res.cloudinary.com/${cloudName}`)) return;

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Extract public_id from URL: https://res.cloudinary.com/CLOUD/image/upload/v123/folder/filename.ext
    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length < 2) return;
    // Remove version prefix (v123456/) and file extension
    let publicId = urlParts[1].replace(/^v\d+\//, "").replace(/\.[^.]+$/, "");
    
    await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary image deleted: ${publicId}`);
  } catch (err) {
    console.warn("Cloudinary delete failed (non-critical):", err.message);
  }
};

export async function DELETE(request, { params }) {
  try {
    const { entity } = await params;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing entity ID query param" }, { status: 400, headers });
    }

    // Look up the item BEFORE deleting to get its image URL for Cloudinary cleanup
    const localData = getLocalJSONData(entity);
    const itemToDelete = localData.find(item => String(item.id) === String(id));
    const imageUrl = itemToDelete?.image || itemToDelete?.src || null;

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (imageUrl) {
      await deleteCloudinaryImage(imageUrl);
    }

    // 1. SUPABASE ROUTING (Postgres users, members, donors)
    if (supabase && (entity === "members" || entity === "donors")) {
      try {
        const { error } = await supabase.from(entity).delete().eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.warn(`Supabase DELETE ${entity} failed:`, err.message);
      }
    }

    // 2. FIREBASE ROUTING (public dynamic contents)
    if (firebaseDbUrl && entity !== "members" && entity !== "donors") {
      try {
        await fetch(`${firebaseDbUrl}/${entity}/${id}.json`, {
          method: "DELETE"
        });
      } catch (err) {
        console.warn(`Firebase DELETE ${entity} failed:`, err.message);
      }
    }

    // 3. ALWAYS SYNC TO LOCAL JSON FILES (keeps local backup in sync)
    const updatedData = localData.filter(item => String(item.id) !== String(id));
    saveLocalJSONData(entity, updatedData);

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers });
  }
}
