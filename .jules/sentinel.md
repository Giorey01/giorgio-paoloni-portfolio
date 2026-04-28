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

## 2024-05-24 - [CRITICAL] Prevent accidental data leakage of PII to a public test email service
**Vulnerability:** The contact form API used `process.env.NODE_ENV !== 'production'` as the condition to fallback to an Ethereal test account if SMTP configuration was missing. This fallback is insecure as it sends the contact form data (PII) to a public email testing service (Ethereal). If an environment was misconfigured but not strictly named 'production', the system would silently fail open and transmit sensitive user data.
**Learning:** Using `NODE_ENV` to gate security-sensitive features (like mocking data egress) is dangerous. Environment types are broad and configurations might be missing. We need a more explicit 'opt-in' mechanism for such overrides.
**Prevention:** Always use explicit feature flags (e.g., `process.env.ENABLE_TEST_EMAIL === 'true'`) for dangerous debug/test fallbacks rather than relying on `NODE_ENV`. This ensures the fallback is only activated deliberately.
