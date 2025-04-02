
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;
        const [rows]: any = await pool.query("SELECT id, name, fullName, email, telephone, profile, created_at FROM users WHERE id = ?", [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = rows[0];
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;
        const formData = await req.formData();

        const name = formData.get("name");
        const password = formData.get("password");
        const fullName = formData.get("fullName");
        const email = formData.get("email");
        const telephone = formData.get("telephone");
        const profileFile = formData.get("profile");

        if (!name || !fullName || !email || !telephone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let profilePath = null;
        if (profileFile instanceof Blob) {
            const buffer = Buffer.from(await profileFile.arrayBuffer());
            const filename = `${Date.now()}_${profileFile.name}`;
            const filePath = path.join(process.cwd(), "public/uploads", filename);
            await fs.promises.writeFile(filePath, buffer);
            profilePath = `/uploads/${filename}`;
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10); // Hash the password with salt rounds = 10
        }

        // Prepare update query
        let updateQuery = `
            UPDATE users 
            SET name = ?, fullName = ?, email = ?, telephone = ? 
            ${hashedPassword ? ", password = ?" : ""}
            ${profilePath ? ", profile = ?" : ""}
            WHERE id = ?
        `;

        let values = [name, fullName, email, telephone];
        if (hashedPassword) values.push(hashedPassword);
        if (profilePath) values.push(profilePath);
        values.push(userId);

        const [result]: any = await pool.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "User not found or no changes made" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        // Check if the user exists and fetch the profile path
        const [rows]: any = await pool.query("SELECT profile FROM users WHERE id = ?", [userId]);
        if (rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const profilePath = rows[0].profile;

        // Delete the user from the database
        const [result]: any = await pool.query("DELETE FROM users WHERE id = ?", [userId]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "User not found or could not be deleted" }, { status: 404 });
        }

        // Delete the profile file if it exists
        if (profilePath) {
            const filePath = path.join(process.cwd(), "public", profilePath);
            try {
                await fs.promises.unlink(filePath);
            } catch (err) {
                console.warn("Failed to delete profile file:", err);
            }
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
