"use server";
import { NextResponse } from "next/server";
import pool  from "@/lib/db";

// GET: Retrieve member details by ID
export async function GET(request, { params }) {
  try {
    const [member] = await pool.query("SELECT * FROM members WHERE id = ?", [
      params.id,
    ]);

    if (!member.length) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member[0]); // Return member data
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a member by ID
export async function DELETE(request, { params }) {
  try {
    const result = await pool.query("DELETE FROM members WHERE id = ?", [
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Member deleted successfully" }, { status: 204 });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT: Update member details
export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    const [result] = await pool.query("UPDATE members SET ? WHERE id = ?", [
      data,
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Member updated successfully", ...data });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
