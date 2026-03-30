/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import pool from "../../../lib/db";

export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.json();
        const { accountNumber, fullName, memberNo, type, amount, description,transactionType,date } = body;

        // Validate required fields
        if (!accountNumber || !fullName || !memberNo || !type || !date || amount === undefined || !transactionType ) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Ensure numerical fields are valid
        const validAmount = parseFloat(amount);

        // Insert into database
        const insertQuery = `
            INSERT INTO dnc (type, accountNumber, fullName, memberNo, amount,date, description,transactionType) 
            VALUES (?, ?, ?, ?, ?, ?,?,?)
        `;
        const values = [type, accountNumber, fullName, memberNo, validAmount,date, description || null,transactionType || null];

        const [result] = await pool.query(insertQuery, values);

        return new Response(JSON.stringify({ message: "DNC record created successfully", insertedId: (result as any).insertId }), { status: 201 });

    } catch (error) {
        console.error("Error in POST:", error);
        return new Response(JSON.stringify({ error: "Failed to create DNC record" }), { status: 500 });
    }
}


export async function GET(req: Request) {
    try {
        // Extract accountNumber from query parameters
        const url = new URL(req.url);
        const meemberNo = url.searchParams.get("memberNo");

        let query = "SELECT * FROM dnc";
        let values: any[] = [];

        if (meemberNo) {
            query += " WHERE memberNo = ?";
            values.push(meemberNo);
        }

        const [rows] = await pool.query(query, values);

        //  Ensure we always return JSON, even if empty
        if (!rows || (Array.isArray(rows) && rows.length === 0)) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        return new Response(JSON.stringify(rows), { status: 200 });

    } catch (error) {
        console.error("Error in GET:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch FOSA statements" }), { status: 500 });
    }
}
