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

## 2024-05-24 - [HIGH] Prevent PII Leakage in Preview/Staging Environments
**Vulnerability:** The contact form API used a fallback mechanism (`process.env.NODE_ENV !== 'production'`) to send user data (PII) to an Ethereal test account if SMTP settings were missing. If deployed to a non-production environment (like a Vercel preview or staging) without valid SMTP settings, it could silently leak user data submitted to the form to the test service.
**Learning:** Checking `NODE_ENV` is insufficient protection against sending real user data to third-party testing services, as non-production environments may still process real (or sensitive test) data.
**Prevention:** Secure test fallbacks with explicit feature flags (e.g., `process.env.ENABLE_TEST_EMAIL === 'true'`) rather than relying on `NODE_ENV`.
