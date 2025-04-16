/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

"use server";

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
      const userId = params.id;
      const [rows]: any = await pool.query("SELECT * FROM dnc WHERE id = ?", [userId]);

      if (rows.length === 0) {
          return NextResponse.json({ error: "transaction not found" }, { status: 404 });
      }

      const user = rows[0];
      return NextResponse.json(user, { status: 200 });
  } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}
  

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const [result]: any = await pool.query("DELETE FROM dnc WHERE id = ?", [userId]);

    // Check if any row was deleted
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "transaction deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}