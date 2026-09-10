import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}

export async function POST(request) {
  let fileData = null;
  try {
    const body = await request.json();
    fileData = body.file; // Data URI base64 string: "data:image/...;base64,..."
    
    if (!fileData) {
      return NextResponse.json({ success: false, error: "Missing file payload" }, { status: 400, headers });
    }

    // Fallback: If Cloudinary keys are missing, return the data URI directly
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log("Cloudinary credentials missing, returning base64 data URL");
      return NextResponse.json({ success: true, url: fileData }, { headers });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: "dyfi-dakshina-kannada",
    });

    return NextResponse.json({ success: true, url: uploadResponse.secure_url }, { headers });
  } catch (error) {
    console.error("Cloudinary upload error, falling back to base64:", error.message);
    // Graceful fallback: return the original base64 data URI so the image is not lost
    if (fileData) {
      return NextResponse.json({ success: true, url: fileData }, { headers });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers });
  }
}
