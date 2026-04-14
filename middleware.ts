import { NextResponse, NextRequest } from "next/server";
import pool from "./src/lib/db";

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("session_token")?.value;

  const isApiRequest = req.nextUrl.pathname.startsWith("/api");
  const isLoginPage = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/";

  if (!sessionToken) {
    if (isApiRequest && !isLoginPage && !req.nextUrl.pathname.startsWith("/api/users/login")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Fetch user session from DB
  const [users]: any = await pool.query("SELECT * FROM users WHERE session_token = ?", [sessionToken]);

  if (!users || users.length === 0) {
    const response = isApiRequest
        ? NextResponse.json({ error: "Invalid session" }, { status: 401 })
        : NextResponse.next();

    if (!isApiRequest) {
        // Clear invalid cookie if not an API request (to let ProtectedLayout handle redirect)
    }
    return response;
  }

  const user = users[0];

  // Check if session has expired (using a default if session_expires_at is null)
  if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
    await pool.query("UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?", [user.id]);
    const response = isApiRequest
        ? NextResponse.json({ error: "Session expired, please log in again" }, { status: 401 })
        : NextResponse.next();
    return response;
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
