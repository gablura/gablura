import { logout } from "@gablura/auth-next";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(await getAuthOptions());
  const backendUrl = process.env.AUTH_BACKEND_URL;

  if (backendUrl && session?.backendToken) {
    await logout(backendUrl, session.backendToken);
  }

  return NextResponse.json({ ok: true });
}
