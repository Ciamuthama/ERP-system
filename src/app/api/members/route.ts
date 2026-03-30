
//ts-ignore

"use server";

import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the next member number
    const [lastMember] = await pool.query("SELECT MAX(memberNo) AS lastMemberNo FROM members");
    const nextMemberNo = lastMember[0]?.lastMemberNo ? lastMember[0].lastMemberNo + 1 : 1001;

    // Get all members
    const [members] = await pool.query("SELECT * FROM members");

    return NextResponse.json({ nextMemberNo, members }, { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: "Failed to fetch members data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
