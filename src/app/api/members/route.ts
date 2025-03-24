"use server";

import { NextResponse } from "next/server";
import pool from "@/lib/db";

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
    const { memId, fullName, telephone, emailAddress, title, accountNumber } = await req.json();
    const [lastMember] = await pool.query("SELECT MAX(memberNo) AS lastMemberNo FROM members");
    const nextMemberNo = lastMember[0]?.lastMemberNo ? lastMember[0].lastMemberNo + 1 : 1001;

    const [result] = await pool.query(
      `INSERT INTO members (memberNo, memId, fullName, telephone, accountNumber, emailAddress, title)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nextMemberNo, memId, fullName, telephone, accountNumber, emailAddress, title]
    );

    return result.affectedRows === 1
      ? NextResponse.json({ message: "Member created successfully", memberNo: nextMemberNo, accountNumber }, { status: 201 })
      : NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
