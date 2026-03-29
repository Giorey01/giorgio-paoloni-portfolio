## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.
## 2025-05-24 - [Rate Limiting IP Spoofing Bypass]
**Vulnerability:** The rate limiter in `src/app/api/contact/route.ts` used the `x-forwarded-for` header to identify client IPs. This allowed for an IP spoofing bypass because an attacker could send custom `x-forwarded-for` headers to appear as different IPs.
**Learning:** Next.js API routes (especially behind reverse proxies like Vercel) provide a built-in `request.ip` property when using `NextRequest`. Relying on manual header parsing for security controls (like rate limiting) without proper validation of trust boundaries is a common pitfall.
**Prevention:** Always use the framework's built-in tools (like `NextRequest.ip`) for extracting client identity, rather than manually parsing headers that can be manipulated by the client. Fallback to `x-forwarded-for` only when `request.ip` is explicitly unavailable, and only if the proxy infrastructure is trusted to validate it.
