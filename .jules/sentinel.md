## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.

## 2026-04-08 - [Unhandled URIError from decodeURIComponent]
**Vulnerability:** Next.js pages or API routes calling `decodeURIComponent()` directly on user input (like dynamic route parameters `params.slug`) without a `try/catch` block.
**Learning:** If a user passes an invalid URL-encoded string (e.g., `%E0%A4%A`), `decodeURIComponent` throws a `URIError`. In Next.js Server Components, this unhandled exception crashes the request, resulting in a 500 Internal Server Error, which can be exploited for a Denial of Service (DoS).
**Prevention:** Always wrap `decodeURIComponent` (and `JSON.parse`) in a `try/catch` block when processing untrusted input, falling back gracefully to the raw input or a 400 error.
