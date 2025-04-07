/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
//ts-ignore
"use server";
import { NextResponse } from "next/server";
import pool  from "@/lib/db";


export async function GET({ params }) {
  try {
    const [member] = await pool.query("SELECT * FROM dnc WHERE memberNo = ?", [
      params.memberNo,
    ]);

    if (!member.length) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member[0]);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

  