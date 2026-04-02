## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.

## 2024-05-24 - [MEDIUM] Prevent Server Crash via URIError on Untrusted Route Parameters
**Vulnerability:** In dynamic routes like `src/app/portfolio/[slug]/page.tsx`, passing an untrusted parameter directly into `decodeURIComponent()` risks causing an unhandled `URIError` when the user supplies a malformed string (e.g., `%`). This crashes the server and returns a 500 error instead of a graceful 4xx response, representing a Denial of Service risk for the page.
**Learning:** Next.js dynamic parameters are completely untrusted inputs that must be treated cautiously. Functions like `decodeURIComponent()` or `JSON.parse()` can throw unhandled runtime exceptions.
**Prevention:** Wrap all decodings/parsing of dynamic route parameters in `try...catch` blocks. Return a safe, controlled user interface if parsing fails, rather than crashing the page rendering process.
