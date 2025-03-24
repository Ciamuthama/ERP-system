/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import pool from "@/lib/db";

export async function POST(req: Request) {
    try {
        // Ensure the table exists
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS fosa (
                id INT AUTO_INCREMENT PRIMARY KEY,
                accountNumber VARCHAR(50) NOT NULL UNIQUE,
                memberName VARCHAR(255) NOT NULL,
                memberNo VARCHAR(50) NOT NULL UNIQUE,
                transactionDate DATE NOT NULL,
                transactionType VARCHAR(100) NOT NULL,
                loanAmount BIGINT NOT NULL DEFAULT 0,
                loanBalance BIGINT NOT NULL DEFAULT 0,
                savings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                withdrawable DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                shares DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                description TEXT DEFAULT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(createTableQuery);

        // Parse request body
        const body = await req.json();
        let { accountNumber, memberName, memberNo, transactionDate, transactionType, loanAmount, loanBalance, savings, withdrawable, shares, description } = body;

        // ✅ Validate required fields
        if (!accountNumber || !memberName || !memberNo || !transactionDate || !transactionType) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // ✅ Convert transactionDate to YYYY-MM-DD
        const formattedDate = new Date(transactionDate).toISOString().split("T")[0];

        // ✅ Ensure numerical fields are valid (avoid NaN issues)
        loanAmount = loanAmount !== undefined && loanAmount !== null && loanAmount !== "" ? parseFloat(loanAmount) : 0;
        loanBalance = loanBalance !== undefined && loanBalance !== null && loanBalance !== "" ? parseFloat(loanBalance) : 0;
        savings = savings !== undefined && savings !== null && savings !== "" ? parseFloat(savings) : 0;
        withdrawable = withdrawable !== undefined && withdrawable !== null && withdrawable !== "" ? parseFloat(withdrawable) : 0;
        shares = shares !== undefined && shares !== null && shares !== "" ? parseFloat(shares) : 0;

        // Insert into database
        const insertQuery = `
            INSERT INTO fosa (accountNumber, memberName, memberNo, transactionDate, transactionType, loanAmount, loanBalance, savings, withdrawable, shares, description) 
            VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [accountNumber, memberName,memberNo, formattedDate, transactionType, loanAmount, loanBalance, savings, withdrawable, shares, description || null];

        await pool.query(insertQuery, values);

        return new Response(JSON.stringify({ message: "FOSA statement created successfully" }), { status: 201 });

    } catch (error) {
        console.error("Error in POST:", error);
        return new Response(JSON.stringify({ error: "Failed to create FOSA statement" }), { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        // Extract accountNumber from query parameters
        const url = new URL(req.url);
        const meemberNo = url.searchParams.get("memberNo");

        let query = "SELECT * FROM fosa";
        let values: any[] = [];

        if (meemberNo) {
            query += " WHERE memberNo = ?";
            values.push(meemberNo);
        }

        const [rows] = await pool.query(query, values);

        // ✅ Ensure we always return JSON, even if empty
        if (!rows || (Array.isArray(rows) && rows.length === 0)) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        return new Response(JSON.stringify(rows), { status: 200 });

    } catch (error) {
        console.error("Error in GET:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch FOSA statements" }), { status: 500 });
    }
}
