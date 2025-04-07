import pool from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const body = JSON.parse(bodyText);
        const { accountName, accountNumber, balances, isBankAccount } = body;

        if (!accountName || !accountNumber || balances === undefined) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // If isBankAccount is true, ensure no other bank account exists
        if (isBankAccount) {
            const [existingBank] = await pool.query(
                'SELECT COUNT(*) AS bankCount FROM chartofaccount WHERE isBankAccount = 1'
            );

            if (existingBank[0].bankCount > 0) {
                return new Response(JSON.stringify({ error: 'Only one bank account is allowed', alert: true }), { status: 400 });
            }
        }

        // Insert into database
        const insertQuery = `
            INSERT INTO chartofaccount (accountName, accountNumber, balances, isBankAccount)
            VALUES (?, ?, ?, ?)
        `;
        const values = [accountName, accountNumber, parseFloat(balances) || 0, isBankAccount ? 1 : 0];
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
