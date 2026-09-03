import { NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_TTL_SECONDS, createSessionValue, isValidAdminPassword } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password || !isValidAdminPassword(password)) {
      return NextResponse.json({ error: "Password salah." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, createSessionValue(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login gagal." },
      { status: 500 }
    );
  }
}
