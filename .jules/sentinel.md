## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.
## 2024-05-30 - [IP Spoofing Vulnerability in API Rate Limiter]
**Vulnerability:** The contact form API (`src/app/api/contact/route.ts`) was using the *last* IP address in the `x-forwarded-for` header list to track rate limiting instead of prioritizing proxy-verified headers. An attacker could spoof their IP address or the rate limiter could incorrectly target the proxy server itself.
**Learning:** In proxy environments like Vercel, `x-forwarded-for` contains a comma-separated list `client, proxy1, proxy2`. The right-most IPs are the proxies, and the first IP is the original client. Trusting the last IP means rate-limiting the proxy, not the attacker.
**Prevention:** Always prioritize trusted headers set by the hosting infrastructure (e.g., `x-real-ip` in Vercel). If falling back to `x-forwarded-for`, extract the first IP (index 0) to correctly identify the original client.
