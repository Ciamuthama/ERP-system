/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import pool from "../../../lib/db";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const meemberNo = url.searchParams.get("memberNo");

        let query = "SELECT * FROM dnc";
        let values: any[] = [];

        if (meemberNo) {
            query += " WHERE memberNo = ?";
            values.push(meemberNo);
        }

        const [rows] = await pool.query(query, values);

        if (!rows || (Array.isArray(rows) && rows.length === 0)) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        return new Response(JSON.stringify(rows), { status: 200 });

    } catch (error) {
        console.error("Error in GET:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch FOSA statements" }), { status: 500 });
    }
}
