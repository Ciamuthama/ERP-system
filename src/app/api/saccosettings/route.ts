import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import path from "path";
import fs from "fs/promises";

// Ensure the table exists
async function ensureTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sacco_company (
        id INT AUTO_INCREMENT PRIMARY KEY,
        companyName VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        logo VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  await pool.query(createTableQuery);
}

export async function POST(req: NextRequest) {
  try {
    await ensureTableExists();

    const formData = await req.formData();
    const companyName = formData.get("companyName") as string;
    const address = formData.get("address") as string;
    const email = formData.get("email") as string;
    const telephone = formData.get("telephone") as string;
    const logoFile = formData.get("logo") as File | null;

    if (!companyName || !logoFile || !email || !telephone || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate a unique file name to prevent overwriting
    const uniqueFilename = `${Date.now()}-${logoFile.name}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    const fileBuffer = await logoFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    const logoPath = `/uploads/${uniqueFilename}`;

    // Check if a SACCO setting already exists
    const [existing]: any[] = await pool.query("SELECT id FROM sacco_company LIMIT 1");

    if (existing.length > 0) {
      // Update the existing record
      const updateQuery = `
        UPDATE sacco_company 
        SET companyName = ?, address = ?, logo = ?, telephone = ?, email = ?
        WHERE id = ?
      `;
      await pool.query(updateQuery, [companyName, address, logoPath, telephone, email, existing[0].id]);
    } else {
      // Insert a new record
      const insertQuery = `
        INSERT INTO sacco_company (companyName, address, logo, telephone, email) 
        VALUES (?, ?, ?, ?, ?)
      `;
      await pool.query(insertQuery, [companyName, address, logoPath, telephone, email]);
    }

    return NextResponse.json(
      { message: "SACCO settings saved successfully", logoPath },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to save SACCO settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ensureTableExists();
    const [rows]: any[] = await pool.query("SELECT * FROM sacco_company LIMIT 1");

    if (rows.length === 0) {
      return NextResponse.json({ message: "No SACCO settings found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch SACCO settings" },
      { status: 500 }
    );
  }
}
