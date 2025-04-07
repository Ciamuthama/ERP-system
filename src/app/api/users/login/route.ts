/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

"use server";

import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

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

    // Check if user is already logged in
    if (user.session_token) {
      return NextResponse.json({ error: "User already logged in" }, { status: 403 });
    }

    // Generate a new session token
    const sessionToken = randomUUID();

    // Store the session token in the database
    await pool.query("UPDATE users SET session_token = ? WHERE id = ?", [sessionToken, user.id]);

    // Set the session token as a secure, HTTP-only cookie
    const response = NextResponse.json(
      { user: { id: user.id, name: user.name } },
      { status: 200 }
    );

    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60, 
    });

    return response;
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
