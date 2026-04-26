## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.
## 2026-04-26 - [Fix DoS vulnerability via unhandled URIError]
**Vulnerability:** Unhandled URIError when decoding invalid URI components in dynamic route parameters (`decodeURIComponent(slug)` in `src/app/portfolio/[slug]/page.tsx`), which could lead to a 500 Internal Server Error (Denial of Service).
**Learning:** In Next.js App Router, dynamic route parameters (e.g., `params.slug`) must be treated as untrusted user input. If passed directly to decoding functions without try/catch, maliciously crafted URLs (e.g., `/%2`) will crash the server.
**Prevention:** Always wrap functions that parse or decode user-provided URL parameters (like `decodeURIComponent()` or `JSON.parse()`) in a `try...catch` block and gracefully handle errors.
