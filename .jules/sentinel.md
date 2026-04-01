## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.

## 2024-05-18 - [Unhandled URIError Exception in Dynamic Routes]
**Vulnerability:** Calling `decodeURIComponent()` directly on dynamic route parameters (`params.slug`) without a `try...catch` block. This allows attackers to craft malformed URLs (e.g., `/portfolio/%C2`) that cause an unhandled `URIError`.
**Learning:** In Next.js App Router, unhandled exceptions in Server Components can crash the request process and lead to a 500 Internal Server Error, posing a localized Denial of Service (DoS) risk and poor user experience. Dynamic route parameters must always be treated as untrusted input.
**Prevention:** Always wrap functions that parse or decode dynamic URL parameters (like `decodeURIComponent()` or `JSON.parse()`) in `try...catch` blocks to gracefully handle malformed input and return a controlled error response (e.g., a "Not Found" or "Invalid URL" UI).
