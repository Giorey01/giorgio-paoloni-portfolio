## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.

## 2024-05-24 - [MEDIUM] Prevent Unhandled URIError DoS from Untrusted Input
**Vulnerability:** The application was directly passing untrusted user input (URL parameters like `params.slug`) to `decodeURIComponent()` without a `try...catch` block. If a malicious user supplies a malformed URI component (e.g., `%C2`), it causes Node.js to throw a `URIError`, resulting in an unhandled exception and a 500 Internal Server Error crash.
**Learning:** Any native function that parses or decodes strings (like `decodeURIComponent`, `JSON.parse`) can throw exceptions if the input is malformed. When these functions are fed untrusted input (e.g., URL params, query strings, headers), they become a vector for Denial of Service (DoS) attacks.
**Prevention:** Always wrap functions that decode or parse untrusted user input in a `try...catch` block to handle malformed data gracefully and prevent server crashes.
