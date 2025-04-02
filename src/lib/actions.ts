"use server";
import pool from "./db";


export async function getUsers() {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Database error:", error);
    //throw new Error("Failed to fetch users");
  }
}

export async function getMember() {
    try{
        const [rows] = await pool.query("SELECT * FROM members")
        return rows
    } catch (error) {
        console.error("Database error:", error);
        //throw new Error("Failed to fetch members");
    }
    
}

export async function getSingleMember(memberNo: string) {
    try {
        const [rows] = await pool.query("SELECT * FROM members WHERE memberNo = ?", [memberNo]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("Database error:", error);
        //throw new Error("Failed to fetch member");
    }
}


export async function getSaccoSettings(){
  try{
    const [rows] = await pool.query("SELECT * FROM sacco_company")
    return rows
} catch (error) {
    console.error("Database error:", error);
    //throw new Error("Failed to fetch members");
}
}

export async function getDNC(){
  try{
    const [rows] = await pool.query("SELECT * FROM dnc")
    return rows
} catch (error) {
    console.error("Database error:", error);
    //throw new Error("Failed to fetch members");
}
}


