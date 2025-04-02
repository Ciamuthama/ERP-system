// app/api/users/login/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, password } = await req.json();

    // Query the user (using plain text passwords for simplicity)
    const [users] = await pool.query("SELECT * FROM users WHERE name = ? AND password = ?", [name, password]);

    if (!users || (Array.isArray(users) && users.length === 0)) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = users[0];
    // Return user details (in a real app, NEVER send password back)
    return NextResponse.json({ user: { id: user.id, name: user.name } }, { status: 200 });
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
