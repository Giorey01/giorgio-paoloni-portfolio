## 2024-05-24 - [MEDIUM] Prevent resource exhaustion in benchmark API
**Vulnerability:** The `/api/benchmark` endpoint was exposed in production, allowing unauthenticated users to trigger expensive S3 operations (list objects). This could lead to a Denial of Wallet (DoW) or Denial of Service (DoS) attack.
**Learning:** Next.js API routes that perform heavy or costly operations, especially those created for testing or benchmarking purposes, must be protected or removed before production deployment.
**Prevention:** Always restrict access to such endpoints using an environment check (`if (process.env.NODE_ENV !== 'development') { return NextResponse.json({ error: 'Not Found' }, { status: 404 }); }`) or robust authentication.

## 2024-05-24 - [HIGH] Prevent Rate Limiting Bypass via IP Spoofing
**Vulnerability:** The rate limiter in the contact form API was extracting the client IP using `x-forwarded-for.split(',')[0]`. This allows a malicious user to trivially bypass rate limits by spoofing the `X-Forwarded-For` header and supplying a comma-separated list of fake IPs.
**Learning:** In environments behind reverse proxies (like Vercel), the outermost trusted proxy appends the real client IP to the *end* of the `x-forwarded-for` chain. Taking the first IP is insecure because the client can inject arbitrary values at the start of the chain.
**Prevention:** Always extract the *last* IP address in the `x-forwarded-for` chain (or rely on platform-specific verified headers) to securely identify clients for rate limiting and prevent IP spoofing bypasses.

## 2024-05-18 - [Unhandled Exception Prevention]
**Vulnerability:** Unhandled `URIError` when decoding URL parameters (e.g., `decodeURIComponent(slug)`) causing a 500 Internal Server Error / application crash when a user provides a malformed URL parameter like `/%A`.
**Learning:** Dynamic route parameters (`params.slug`) should always be treated as untrusted user input, even in functions like `decodeURIComponent()` which can throw native runtime errors.
**Prevention:** Wrap functions that decode or parse user input (like `decodeURIComponent()` or `JSON.parse()`) in a `try...catch` block to gracefully handle invalid input and return an appropriate error response (or safe fallback UI) without crashing the server.

## 2024-05-25 - [HIGH] Remove development endpoints from production codebase
**Vulnerability:** Development-only or benchmark API endpoints present in the production codebase pose a severe risk of resource exhaustion and data leakage, even when gated by `process.env.NODE_ENV !== 'development'`.
**Learning:** Gating development endpoints with environment variables is insufficient protection. Misconfigurations in production environments can inadvertently expose these endpoints, leading to severe vulnerabilities.
**Prevention:** Development-only endpoints must never exist in the production codebase. They should be strictly maintained in separate development branches or external testing tools.

## 2024-06-14 - [HIGH] Prevent Cache Eviction Bypass in Rate Limiter
**Vulnerability:** The in-memory rate limiter used `map.clear()` when it reached its maximum capacity (`MAX_MAP_SIZE`). This allowed a Cache Eviction Bypass where an attacker (or legitimate high traffic) could fill the map, triggering a complete clear and resetting the rate limit for all users, including the attacker.
**Learning:** Using `clear()` on security-critical caches (like rate limiters or brute-force protectors) creates a vulnerability where the protective state is entirely lost under load. JavaScript `Map` objects preserve insertion order, making the first keys the oldest.
**Prevention:** To mitigate Cache Eviction Bypass vulnerabilities in in-memory JavaScript Maps, securely evict the oldest entry instead of using `map.clear()`. In TypeScript, use a while loop and explicitly check for undefined to pass strict build type checking: `const firstKey = map.keys().next().value; if (firstKey !== undefined) map.delete(firstKey); else break;`.
