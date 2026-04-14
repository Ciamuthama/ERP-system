import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { RowDataPacket, FieldPacket } from "mysql2";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [users] = await pool.query("SELECT id, name FROM users WHERE session_token = ? LIMIT 1", [sessionToken]) as [RowDataPacket[], FieldPacket[]];

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: users[0] }, { status: 200 });
  } catch (error) {
    console.error("Check auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
