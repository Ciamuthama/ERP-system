import { NextResponse } from "next/server";
import pool from "./src/lib/db";

export async function middleware(req: Request) {
  const sessionToken = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user session from DB
  const [users]: any = await pool.query("SELECT * FROM users WHERE session_token = ?", [sessionToken]);

  if (!users || users.length === 0) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const user = users[0];

  // Check if session has expired
  if (new Date(user.session_expires_at) < new Date()) {
    await pool.query("UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?", [user.id]);
    return NextResponse.json({ error: "Session expired, please log in again" }, { status: 401 });
  }

  return NextResponse.next();
}
