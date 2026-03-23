## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Fix rate limit bypass via IP spoofing
**Vulnerability:** The contact form API (`/api/contact`) was using the *first* IP address from the `x-forwarded-for` header (`.split(',')[0]`) to identify clients for rate limiting. An attacker could trivially bypass the rate limiter by prepending a spoofed IP to the header, preventing their real IP from being blocked.
**Learning:** In applications behind reverse proxies (like Vercel or Cloudflare), the reverse proxy appends the true client IP to the *end* of the `x-forwarded-for` chain. Any IPs before that can be freely spoofed by the client.
**Prevention:** Always extract the *last* IP address from the `x-forwarded-for` chain (`.split(',').pop()`) when identifying the client's original IP address behind a trusted reverse proxy, or use a framework-provided secure method.
