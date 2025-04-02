import pool from '@/lib/db';

export async function POST(req: Request) {
    try {
        // Debugging: Log the request body
        const bodyText = await req.text();
        console.log("Raw request body:", bodyText);

        // Parse JSON
        const body = JSON.parse(bodyText);
        console.log("Parsed request body:", body);

        const { accountName, accountNumber, balances } = body;

        if (!accountName || !accountNumber || balances === undefined) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Ensure the table exists
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS chartofaccount (
                id INT AUTO_INCREMENT PRIMARY KEY,
                accountName VARCHAR(255) NOT NULL,
                accountNumber BIGINT UNIQUE NOT NULL,
                balances DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(createTableQuery);

        // Insert into database
        const insertQuery = 'INSERT INTO chartofaccount (accountName, accountNumber, balances) VALUES (?, ?, ?)';
        const values = [accountName, accountNumber, parseFloat(balances) || 0];
        await pool.query(insertQuery, values);

        return new Response(JSON.stringify({ message: 'Account created successfully' }), { status: 201 });

    } catch (error) {
        console.error("Error in POST:", error);
        return new Response(JSON.stringify({ error: 'Failed to create account' }), { status: 500 });
    }
}

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM chartofaccount');
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch accounts' }), { status: 500 });
    }
}
