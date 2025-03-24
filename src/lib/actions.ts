"use server";
import pool from "./db";
import { Member } from "./types";

export async function getUsers() {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function getMember() {
    try{
        const [rows] = await pool.query("SELECT * FROM members")
        return rows
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch members");
    }
    
}

export async function getSingleMember(id: string) {
    try {
        const [rows] = await pool.query("SELECT * FROM members WHERE id = ?", [id]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch member");
    }
}


export async function getSaccoSettings(){
  try{
    const [rows] = await pool.query("SELECT * FROM sacco_company")
    return rows
} catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch members");
}
}

