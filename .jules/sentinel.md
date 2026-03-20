## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-25 - [MEDIUM] Relaxed Email Validation Regex
**Vulnerability:** The email validation regex in `src/utils/validation.ts` was overly relaxed (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), potentially allowing malformed inputs (like consecutive dots or invalid TLD lengths) to pass validation.
**Learning:** Regular expressions for user input must be strict enough to reject malformed or potentially harmful data patterns to ensure data integrity and security.
**Prevention:** Use robust, well-tested regular expressions for validating user input like emails (e.g., `/^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/`).
