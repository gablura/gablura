import { NextResponse } from "next/server";
import { authService } from "@/lib/auth/core";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await authService.exchange(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Exchange failed" }, { status: 400 });
  }
}
