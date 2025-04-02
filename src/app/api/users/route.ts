import { NextResponse } from "next/server";
import pool from "@/lib/db";
import path from "path";
import fs from "fs";




  export async function POST(req: Request) {
    const formData = await req.formData(); 
    const name = formData.get("name");
    const password = formData.get("password");
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const telephone = formData.get("telephone");
    const profileFile = formData.get("profile"); 
  
    if (!name || !password || !fullName || !email || !telephone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    let profilePath = null;
    if (profileFile instanceof Blob) {
      const buffer = Buffer.from(await profileFile.arrayBuffer());
      const filename = `${Date.now()}_${profileFile.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      await fs.promises.writeFile(filePath, buffer);
      profilePath = `/uploads/${filename}`;
    }
  
    const insertQuery = `
      INSERT INTO users (name, password, fullName, email, telephone, profile)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, password, fullName, email, telephone, profilePath];
    const [result]: any = await pool.query(insertQuery, values);
  
    return NextResponse.json(
      { message: "User created successfully", userId: result.insertId, profile: profilePath },
      { status: 201 }
    );
  }

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, name, fullName, email, telephone, profile, created_at FROM users");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
