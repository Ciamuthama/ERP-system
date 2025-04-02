import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        // Fetch the user from the database
        const query = `SELECT id, name, fullName, email, telephone, profile, password FROM users WHERE id = ?`;
        const [rows]: any = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        // Parse the request body
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const telephone = formData.get("telephone") as string;
        const profilePicture = formData.get("profile") as File | null;

        // Handle profile picture upload if provided
        let profilePicturePath = null;
        if (profilePicture) {
            const uploadDir = path.join(process.cwd(), "public/uploads");
            await fs.mkdir(uploadDir, { recursive: true });

            const fileName = `${userId}-${Date.now()}-${profilePicture.name}`;
            profilePicturePath = path.join(uploadDir, fileName);

            const fileBuffer = Buffer.from(await profilePicture.arrayBuffer());
            await fs.writeFile(profilePicturePath, fileBuffer);

            // Save the relative path to the database
            profilePicturePath = `/uploads/${fileName}`;
        }

        // Update the user in the database
        const query = `
            UPDATE users 
            SET name = ?, fullName = ?, email = ?, telephone = ?, password = ?, profile = ?
            WHERE id = ?
        `;
        const values = [name, fullName, email, telephone, password, profilePicturePath, userId];
        const [result]: any = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
