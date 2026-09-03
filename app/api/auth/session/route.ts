import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/adminAuth";

export async function GET() {
  return NextResponse.json({ authenticated: await hasAdminSession() });
}
