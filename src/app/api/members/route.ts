
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
//ts-ignore

"use server";

import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [lastMember] = await pool.query("SELECT MAX(memberNo) AS lastMemberNo FROM members");
    const nextMemberNo = lastMember[0]?.lastMemberNo ? lastMember[0].lastMemberNo + 1 : 1001;
    return NextResponse.json({ nextMemberNo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch next member number" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Ensure the "members" table exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        memberNo INT NOT NULL UNIQUE,
        memId VARCHAR(50) NOT NULL UNIQUE,
        title VARCHAR(100) DEFAULT NULL,
        fullName VARCHAR(255) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        accountNumber VARCHAR(50) NOT NULL UNIQUE,
        openingBalance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        emailAddress VARCHAR(255) DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);

   
    const { memId, fullName, telephone, emailAddress, title, accountNumber, openingBalance } = await req.json();
    
    const [lastMember] = await pool.query("SELECT MAX(memberNo) AS lastMemberNo FROM members");
    const nextMemberNo = lastMember[0]?.lastMemberNo ? lastMember[0].lastMemberNo + 1 : 1001;

    const [result] = await pool.query(
      `INSERT INTO members (memberNo, memId, fullName, telephone, accountNumber, openingBalance, emailAddress, title)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nextMemberNo, memId, fullName, telephone, accountNumber, openingBalance, emailAddress, title]
    );

    return result.affectedRows === 1
      ? NextResponse.json({ message: "Member created successfully", memberNo: nextMemberNo, accountNumber }, { status: 201 })
      : NextResponse.json({ error: "Failed to create member" }, { status: 500 });

  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
