import { NextResponse } from "next/server";
import { testFirestoreConnection } from "@/lib/firestore";

export async function GET() {
  const firestoreStatus = await testFirestoreConnection();
  return NextResponse.json({
    firestore: {
      projectId: process.env.FIREBASE_PROJECT_ID || "dyfi-dk",
      connected: firestoreStatus.connected,
      status: firestoreStatus.status || 0,
      error: firestoreStatus.error || null,
    },
    auth: {
      provider: "Supabase",
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
  });
}
