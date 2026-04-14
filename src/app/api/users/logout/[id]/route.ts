import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, FieldPacket } from "mysql2";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sessionToken } = await req.json();
    const userId = params.id;

    if (!sessionToken) {
      return NextResponse.json({ error: "Missing session token" }, { status: 400 });
    }

    const [result] = await pool.query(
      "SELECT id FROM users WHERE session_token = ? LIMIT 1",
      [sessionToken]
    ) as [RowDataPacket[], FieldPacket[]];

    if (!Array.isArray(result) || result.length === 0 || result[0].id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await pool.query("UPDATE users SET session_token = NULL WHERE id = ?", [userId]);

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
