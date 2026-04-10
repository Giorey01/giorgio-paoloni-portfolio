## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.

## 2024-05-24 - [MEDIUM] Prevent Unhandled URIError (DoS Risk) in Dynamic Routes
**Vulnerability:** In Next.js dynamic routes, calling `decodeURIComponent(params.slug)` on untrusted user input can throw an unhandled `URIError` if a malicious user provides a malformed URI component (e.g., `%E0%A4%A`). This causes a 500 Internal Server Error, potentially crashing the server or exhausting resources (DoS).
**Learning:** Next.js dynamic parameters from the URL must be treated as untrusted user input. Any decoding or parsing of these parameters must be wrapped in error handling blocks to prevent the application from crashing.
**Prevention:** Always wrap functions like `decodeURIComponent()` or `JSON.parse()` when processing dynamic route parameters in a `try...catch` block, and return a graceful 400-style error (like an "Invalid URL parameter" message) upon failure.
