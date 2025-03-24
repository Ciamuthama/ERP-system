import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Storage configuration for file uploads
const upload = multer({ dest: "public/uploads/" });

// Ensure the table exists
async function ensureTableExists() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS sacco_company (
            id INT AUTO_INCREMENT PRIMARY KEY,
            companyName VARCHAR(255) NOT NULL,
            address1 VARCHAR(255) NOT NULL,
            logo VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
  await pool.query(createTableQuery);
}

// Handle **POST request**
export async function POST(req: NextRequest) {
  try {
    await ensureTableExists(); // ✅ Ensure the table exists

    // ✅ Extract FormData fields
    const formData = await req.formData();
    const companyName = formData.get("companyName") as string;
    const address1 = formData.get("address1") as string;
    const logoFile = formData.get("logo") as File | null;

    // ✅ Validation: Ensure all required fields are provided
    if (!companyName || !logoFile) {
      return NextResponse.json(
        { error: "Company name and logo are required" },
        { status: 400 }
      );
    }

    // ✅ Save the uploaded file
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadsDir, { recursive: true }); // Ensure directory exists

    const filePath = path.join(uploadsDir, logoFile.name);
    const fileBuffer = await logoFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    const logoPath = `/uploads/${logoFile.name}`;

    // ✅ Insert into DB
    const query = `INSERT INTO sacco_company (companyName, address1, logo) VALUES (?, ?, ?)`;
    const values = [companyName, address1, logoPath];

    await pool.query(query, values);

    return NextResponse.json(
      { message: "Sacco company registered successfully", logoPath },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to create Sacco company" },
      { status: 500 }
    );
  }
}

// Handle **GET request**
export async function GET() {
  try {
    await ensureTableExists();

    const [rows] = await pool.query("SELECT * FROM sacco_company");

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch Sacco company" },
      { status: 500 }
    );
  }
}
