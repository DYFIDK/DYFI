import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  getFirestoreDocuments,
  saveFirestoreDocument,
} from "@/lib/firestore";

const getSettingsFilePath = () => {
  return path.join(process.cwd(), "public", "settings.json");
};

const defaultSettings = {
  id: "contact",
  phone: "0824-2440123",
  helpline: "+91 9448123456",
  email: "dyfioffice.dk@gmail.com",
  address: "DYFI Dakshina Kannada District Committee Office, Mangaluru, Karnataka, India 575001"
};

const getLocalSettings = () => {
  const filePath = getSettingsFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return defaultSettings;
  }
};

const saveLocalSettings = (data) => {
  try {
    fs.writeFileSync(getSettingsFilePath(), JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Save local settings failed:", err);
  }
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  // 1. PRIMARY: Query Firebase Firestore database
  const firestoreRes = await getFirestoreDocuments("settings");
  if (firestoreRes.success && firestoreRes.data && firestoreRes.data.length > 0) {
    const contactDoc = firestoreRes.data.find(d => d.id === "contact") || firestoreRes.data[0];
    return NextResponse.json(contactDoc, { headers: corsHeaders });
  }

  // 2. FALLBACK: Read local settings JSON
  const local = getLocalSettings();
  return NextResponse.json(local, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const updatedSettings = {
      id: "contact",
      phone: body.phone || defaultSettings.phone,
      helpline: body.helpline || defaultSettings.helpline,
      email: body.email || defaultSettings.email,
      address: body.address || defaultSettings.address,
      updatedAt: new Date().toISOString()
    };

    // 1. PRIMARY: Save to Firebase Firestore
    let savedToFirestore = false;
    const firestoreRes = await saveFirestoreDocument("settings", "contact", updatedSettings);
    if (firestoreRes.success) {
      savedToFirestore = true;
    } else {
      console.warn("Firestore settings save failed, using local storage fallback:", firestoreRes.error);
    }

    // 2. ALWAYS SYNC TO LOCAL JSON BACKUP
    saveLocalSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      firestore: savedToFirestore
    }, { headers: corsHeaders });
  } catch (err) {
    console.error("POST /api/settings error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
