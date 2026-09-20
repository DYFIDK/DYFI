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
      return NextResponse.json(
        { success: false, error: "Missing file payload" },
        { status: 400, headers }
      );
    }

    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").toLowerCase().trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("Cloudinary credentials missing — returning base64 as fallback");
      return NextResponse.json(
        { success: true, url: fileData, warning: "Cloudinary not configured, using base64" },
        { headers }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log(`Uploading to Cloudinary (cloud: ${cloudName})...`);

    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: "dyfi-dakshina-kannada",
      resource_type: "image",
    });

    console.log(`Cloudinary upload success: ${uploadResponse.secure_url}`);
    return NextResponse.json(
      { success: true, url: uploadResponse.secure_url },
      { headers }
    );
  } catch (error) {
    console.error("Cloudinary upload FAILED:", error.message || error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload to Cloudinary",
        fallbackUrl: fileData,
      },
      { status: 500, headers }
    );
  }
}
