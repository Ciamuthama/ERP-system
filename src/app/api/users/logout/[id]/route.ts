import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Dynamic route: /api/users/logout/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionCookies = await cookies();
    const sessionToken = sessionCookies.get("session_token")?.value;
    const userId = params.id;

    if (!sessionToken) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // Confirm that the session token matches the user ID
    const [result]: any = await pool.query(
      "SELECT id FROM users WHERE session_token = ?",
      [sessionToken]
    );

    if (result.length === 0 || result[0].id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Clear session token from DB
    await pool.query("UPDATE users SET session_token = NULL WHERE id = ?", [userId]);

    // Clear the session_token cookie
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("session_token", "", { maxAge: 0 });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
