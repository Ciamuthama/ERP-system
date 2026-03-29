# Identified Issues in Sacco Dashboard

This document outlines the security, architectural, and code quality issues identified during a repository scan.

## 1. Security Vulnerabilities

### Hardcoded Database Credentials
- **File**: `src/lib/db.ts`
- **Description**: Database host, user, password, and database name are hardcoded in the source code.
- **Risk**: Exposure of credentials if the repository is leaked or accessed by unauthorized personnel.
- **Suggested Fix**: Use environment variables (`.env.local`) to store sensitive configuration.

### Sensitive Data Exposure in API
- **File**: `src/app/api/users/route.ts`, `src/app/api/users/[id]/route.ts`
- **Description**: The `GET` endpoints for users return `session_token` in the JSON response.
- **Risk**: Anyone with access to the API can see active session tokens for all users, potentially allowing session hijacking.
- **Suggested Fix**: Omit sensitive fields like `session_token` and `password` from API responses.

### Inconsistent Authentication Mechanisms
- **Files**: `src/app/api/users/login/route.ts`, `src/app/api/protected/route.ts`
- **Description**: The login route generates a random UUID as a `session_token` and stores it in the database. However, `src/app/api/protected/route.ts` attempts to verify a JWT token.
- **Risk**: Confusion in authentication logic can lead to bypasses or broken access control.
- **Suggested Fix**: Standardize on one authentication method, preferably JWT or a robust session-based system using a library like NextAuth.js (Auth.js).

### Missing Authorization on API Routes
- **Files**: Most files in `src/app/api/` (e.g., `members`, `chartofaccount`, `fosa`).
- **Description**: Many API routes do not verify the user's session or token before performing operations.
- **Risk**: Unauthorized users or malicious actors can access or modify sensitive data by calling the API endpoints directly.
- **Suggested Fix**: Implement middleware or a shared utility to verify authentication for all protected API routes.

---

## 2. Architectural Flaws

### Fragmented Session Management
- **Description**: Authentication state is tracked across `localStorage` (for client-side expiry check), cookies (set during login), and a `session_token` in the database.
- **Risk**: Hard to maintain, prone to desynchronization, and insecure (localStorage is susceptible to XSS).
- **Suggested Fix**: Centralize session management using HTTP-only cookies and a single source of truth.

### Inefficient Session Polling
- **File**: `src/hooks/checkSession.ts`
- **Description**: The client polls `/api/users` every 2 seconds to check if the current user's session is still valid.
- **Risk**: High overhead on the database and network, poor scalability.
- **Suggested Fix**: Use standard session validation middleware and handle unauthorized (401) responses globally.

### Embedded Table Creation Logic
- **Files**: `src/app/api/members/route.ts`, `src/app/api/saccosettings/route.ts`, etc.
- **Description**: SQL `CREATE TABLE IF NOT EXISTS` statements are executed inside API route handlers.
- **Risk**: Unnecessary database overhead on every request and lack of a proper schema migration path.
- **Suggested Fix**: Use a database migration tool (e.g., Prisma, Drizzle, or a simple migration script) to manage the schema separately from the application logic.

---

## 3. Code Quality Issues

### Redundant Password Hashing Libraries
- **File**: `package.json`
- **Description**: Both `bcrypt` and `bcryptjs` are listed as dependencies.
- **Risk**: Confusion for developers and increased bundle size/attack surface.
- **Suggested Fix**: Choose one (preferably `bcrypt` for performance or `bcryptjs` for ease of installation) and use it consistently.

### Extensive Use of `any` and `//ts-ignore`
- **Files**: Throughout `src/`
- **Description**: TypeScript's type safety is frequently bypassed using `any` types and suppression comments.
- **Risk**: Increases the likelihood of runtime errors and defeats the purpose of using TypeScript.
- **Suggested Fix**: Define proper interfaces/types for database rows, API responses, and component props.

### Inconsistent API Response Formats
- **Files**: `src/app/api/`
- **Description**: Some routes use `NextResponse.json()`, while others use `new Response(JSON.stringify(...))`.
- **Risk**: Inconsistent error handling and harder maintenance.
- **Suggested Fix**: Standardize on `NextResponse` for all Next.js API routes.

### Imperative UI Reloads
- **Files**: `src/components/users.tsx`, `src/components/settings.tsx`, etc.
- **Description**: The code uses `window.location.reload()` to refresh the UI after an action (like saving or deleting).
- **Risk**: Poor User Experience (flashing screen) and unnecessary full-page reloads in a Single Page Application (SPA).
- **Suggested Fix**: Update the local React state or use SWR/React Query to revalidate data without reloading the page.

### Linting and Build Errors
- **Description**: Running `npm run lint` reveals numerous errors related to `any` types, unused variables, and missing dependencies in `useEffect` hooks.
- **Risk**: Potential runtime bugs, memory leaks, and poor maintainability.
- **Suggested Fix**: Resolve all linting errors by providing proper types, removing unused code, and correctly managing hook dependencies.
