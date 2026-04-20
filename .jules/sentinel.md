## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.

## 2024-05-24 - [MEDIUM] Prevent 500 Error Crash from Malformed URI Components
**Vulnerability:** The application was calling `decodeURIComponent(slug)` directly on a user-provided dynamic route parameter (`slug`) in `src/app/portfolio/[slug]/page.tsx`. If a user visited a URL with a malformed URI sequence (e.g., `%`), `decodeURIComponent` threw an unhandled `URIError`, causing a 500 Internal Server Error crash for that request.
**Learning:** In Next.js App Router, dynamic route parameters (like `params.slug`) should be treated as untrusted user input. Built-in JS functions that parse strings (like `decodeURIComponent` or `JSON.parse`) can throw exceptions on malformed input.
**Prevention:** Always wrap functions that decode or parse untrusted user input in a `try...catch` block. Catch the error, log it securely, and return a graceful fallback UI (like a 400 Bad Request or a generic "Invalid URL" message) instead of letting the application crash.
