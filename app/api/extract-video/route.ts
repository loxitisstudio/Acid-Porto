// app/api/extract-video/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ success: false, message: "URL wajib diisi" }, { status: 400 });

    if (/\.(mp4|mov|webm)(?:\?|$)/i.test(url)) {
      return NextResponse.json({ success: true, mp4Url: url, message: "Sudah MP4" });
    }

    return NextResponse.json({
      success: false,
      mp4Url: null,
      message: "Link Instagram tidak bisa di-extract otomatis. Gunakan tombol Upload video file di bawah kolom URL.",
    });
  } catch {
    return NextResponse.json({ success: false, mp4Url: null, message: "Gagal" }, { status: 500 });
  }
}