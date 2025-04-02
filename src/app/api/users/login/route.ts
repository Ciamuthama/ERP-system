import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, password } = await req.json();

    // Query user by name
    const [users]: any = await pool.query("SELECT * FROM users WHERE name = ?", [name]);

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = users[0];

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Return user details (DO NOT send the password back)
    return NextResponse.json({ user: { id: user.id, name: user.name } }, { status: 200 });
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
