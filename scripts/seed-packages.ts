import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local
const envPath = join(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
  if (!process.env[key]) process.env[key] = val;
}

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");

const AUTH_CORE = {
  type: "package",
  name: "@gablura/auth-core",
  slug: "auth-core",
  description:
    "Production-ready authentication core for Express.js backends. Dual-token RS256 JWT architecture with session binding, token rotation, 2FA, account lockout, and audit logging.",
  version: "1.2.4",
  repositoryUrl: "https://github.com/gablura/focura-auth",
  authorId: "seed",
  authorName: "Gablura",
  status: "published",
  featured: true,
  documentation: {
    overview:
      "@gablura/auth-core is a framework-agnostic authentication and authorization library for Node.js/Express backends. It implements a dual-token RS256 JWT architecture with short-lived access tokens (15m) and long-lived refresh tokens (7d), backed by Redis for session tracking, token revocation, and distributed locking. The library provides a high-level AuthService for common operations and low-level advanced APIs for custom integrations.",

    whyItExists:
      "Most teams rebuild authentication from scratch — JWT signing, session tracking, token rotation, 2FA, lockout logic. Each implementation has subtle security bugs. Auth-core exists so you don't have to build this yourself. It encodes years of production patterns: RS256 over HMAC for token signing, Lua scripts for atomic token rotation, device fingerprinting for session binding, and timing-safe comparisons everywhere. The goal is to provide auth primitives that are correct by default and composable when you need customization.",

    features:
      "- Dual-token RS256 JWT architecture (access + refresh)\n- Session binding with device fingerprinting and IP validation\n- Atomic token rotation via Redis Lua scripts\n- TOTP-based two-factor authentication (via otplib)\n- Account lockout with configurable thresholds and windows\n- Distributed refresh locking (prevents token race conditions)\n- Audit logging with severity levels\n- Express middleware factory (authenticate, authorize, CSRF, rate limit)\n- Session timeout management (inactivity + absolute)\n- Token revocation (access, refresh, session-level)\n- Timing-safe comparisons throughout\n- Server-to-server request detection\n- Private IP detection and CIDR-aware trusted proxy support\n- Zod validation schemas for all inputs\n- Zero runtime dependencies beyond Express, Redis, and JSON web tokens",

    installation: "npm install @gablura/auth-core\n# peer dependencies\nnpm install express ioredis",

    quickStart:
      "```typescript\nimport { AuthService } from '@gablura/auth-core';\nimport express from 'express';\n\nconst app = express();\n\nconst auth = new AuthService({\n  redis: redisAdapter,\n  userStore: mongoUserStore,\n  hmacSecret: process.env.AUTH_HMAC_SECRET!,\n  jwt: {\n    privateKey: process.env.AUTH_PRIVATE_KEY!,\n    publicKey: process.env.AUTH_PUBLIC_KEY!,\n    issuer: 'my-app',\n    audience: 'my-backend',\n  },\n});\n\n// Exchange HMAC proof for tokens\napp.post('/auth/exchange', async (req, res) => {\n  const tokens = await auth.exchange({\n    proof: req.body.proof,\n    userAgent: req.headers['user-agent'],\n    acceptLanguage: req.headers['accept-language'],\n  });\n  res.json(tokens);\n});\n\n// Verify token on protected routes\napp.get('/api/me', auth.middleware(), (req, res) => {\n  res.json(req.user);\n});\n```",

    apiReference:
      "## AuthService\n\nThe primary high-level API.\n\n### `exchange(params)`\nExchanges an HMAC proof for a token pair + SSE token. Validates proof TTL (60s), checks idempotency, creates session, checks lockout/ban/email verification.\n\n**Params**: `{ proof: string, userAgent?: string, acceptLanguage?: string }`\n**Returns**: `{ accessToken, refreshToken, sseToken, sessionId }`\n\n### `verifyToken(token)`\nVerifies an access token via RS256. Checks token type, version, revocation status, session binding (device + IP), user existence, ban/email status.\n\n**Params**: `{ token: string, userAgent?: string, acceptLanguage?: string, ip?: string }`\n**Returns**: `TokenPayload` (userId, sessionId, role, etc.)\n\n### `refresh(params)`\nRotates refresh tokens atomically. Uses distributed lock to prevent race conditions. Validates session existence, checks revocation, creates new token pair.\n\n**Params**: `{ refreshToken: string, sessionId: string, userAgent?: string, acceptLanguage?: string }`\n**Returns**: `{ accessToken, refreshToken, sseToken }`\n\n### `logout(params)`\nRevokes access token and optionally all refresh tokens for a session.\n\n**Params**: `{ accessToken: string, refreshToken?: string, sessionId: string, logoutAll?: boolean }`\n\n### `generateTwoFactor(userId)`\nGenerates TOTP secret and provisioning URI for 2FA setup.\n\n### `verifyTwoFactor(userId, token)`\nVerifies a TOTP token against the user's stored secret.\n\n---\n\n## Advanced API\n\nLow-level classes for custom integrations:\n\n- **TokenManager** — RS256 JWT creation/verification\n- **TokenRevocation** — Redis Lua scripts for atomic token operations\n- **SessionManager** — LRU session tracking with concurrent limits\n- **AccountLockout** — Redis-backed failure counting\n- **RefreshLock** — Distributed locking via Redis SETNX\n- **AuditLog** — Severity-tagged audit events\n- **TotpManager** — TOTP generation/verification\n- **MiddlewareFactory** — Express middleware and route handlers\n- **SessionTimeoutManager** — Inactivity + absolute timeout",

    examples:
      "```typescript\n// Custom middleware with role authorization\nimport { MiddlewareFactory } from '@gablura/auth-core';\n\nconst mw = new MiddlewareFactory(authService);\n\napp.get('/admin', mw.authenticate(), mw.authorize('admin'), (req, res) => {\n  res.json({ admin: true });\n});\n```\n---\n```typescript\n// CSRF protection\napp.post('/api/data', mw.authenticate(), mw.csrf(), (req, res) => {\n  // CSRF token validated\n  res.json({ ok: true });\n});\n```\n---\n```typescript\n// Rate limiting\napp.post('/login', mw.rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,\n  keyFn: (req) => req.ip,\n}), exchangeHandler);\n```",

    changelog:
      "## 1.2.4\n- Fix: session binding validation for IPv6 addresses\n- Fix: timing-safe comparison in HMAC proof verification\n\n## 1.2.3\n- feat: add server-to-server request detection\n- feat: add maxSessionAge config option\n\n## 1.2.2\n- fix: concurrent refresh race condition via distributed lock\n- fix: audit log severity filtering\n\n## 1.2.1\n- feat: add ObservabilitySink interface for custom metrics\n- feat: add configurable error factory\n\n## 1.2.0\n- feat: RS256 JWT architecture (replaces HMAC)\n- feat: session binding with device fingerprinting\n- feat: atomic token rotation via Lua scripts\n- feat: TOTP two-factor authentication\n- BREAKING: requires RSA key pair\n\n## 1.1.0\n- feat: account lockout with configurable windows\n- feat: CSRF middleware\n- feat: rate limit middleware",
  },
};

const AUTH_NEXT = {
  type: "package",
  name: "@gablura/auth-next",
  slug: "auth-next",
  description:
    "Production-ready Next.js authentication with NextAuth.js. Drop-in auth with credentials, Google OAuth, 2FA, email verification, and password reset.",
  version: "1.2.4",
  repositoryUrl: "https://github.com/gablura/focura-auth",
  authorId: "seed",
  authorName: "Gablura",
  status: "published",
  featured: false,
  documentation: {
    overview:
      "@gablura/auth-next is a complete authentication solution for Next.js applications using NextAuth.js. It provides drop-in components (login/register forms, email verification, password reset), React hooks for form logic, API route handlers, and a bridge layer for secure communication with the @gablura/auth-core backend. Supports credentials login, Google OAuth, TOTP-based 2FA, and full email lifecycle (verification, forgot password, reset).",

    whyItExists:
      "Setting up NextAuth.js from scratch with credentials provider, JWT callbacks, token exchange with a backend, email verification, password reset, and 2FA is a multi-day effort with many security pitfalls. Auth-next exists to make this a one-line integration. It handles the entire auth flow: form validation (Zod + react-hook-form), argon2 password hashing, HMAC-signed backend communication, automatic token refresh, session management, and all the UI components you need. You configure it once and get a production-ready auth system.",

    features:
      "- Drop-in NextAuth.js configuration via createAuthOptions()\n- Credentials provider with argon2 password verification\n- Google OAuth provider (optional)\n- TOTP-based two-factor authentication\n- Email verification flow (24h expiry tokens)\n- Password reset flow (1h expiry tokens)\n- HMAC-signed backend communication bridge\n- Automatic token refresh (60s before expiry)\n- React hooks for all auth forms (login, register, forgot/reset password)\n- Pre-built UI components (AuthPage, AuthForm, ForgotPassword, ResetPassword, VerifyEmail)\n- Composable form sub-components (Header, Fields, Buttons, Footer)\n- API route handlers (register, verify-email, forgot-password, reset-password)\n- Zod validation on all inputs\n- Rate limiting support on registration\n- Account lockout integration with auth-core\n- Session timeout detection\n- TypeScript types extended from NextAuth\n- ESM-first with tree-shaking",

    installation: "npm install @gablura/auth-next\n# peer dependencies\nnpm install next next-auth react react-dom",

    quickStart:
      "```typescript\n// app/api/auth/[...nextauth]/route.ts\nimport { createAuthOptions } from '@gablura/auth-next';\n\nconst authOptions = await createAuthOptions({\n  hmacSecret: process.env.AUTH_HMAC_SECRET!,\n  backendUrl: process.env.BACKEND_URL!,\n  nextAuthSecret: process.env.NEXTAUTH_SECRET!,\n  dataStore: mongoDataStore,\n  userStore: mongoUserStore,\n  pages: { signIn: '/login' },\n  callbackRoutes: {\n    success: '/dashboard',\n    login: '/login',\n    register: '/register',\n  },\n});\n\nexport const handlers = { GET: handlers.GET, POST: handlers.POST };\nexport { authOptions };\n```\n\n```tsx\n// app/login/page.tsx\nimport { AuthPage } from '@gablura/auth-next/components';\n\nexport default function LoginPage() {\n  return <AuthPage />;\n}\n```",

    apiReference:
      "## createAuthOptions(config)\n\nCreates a complete NextAuth.js configuration.\n\n**Config options**:\n- `hmacSecret` — shared HMAC secret for backend communication\n- `backendUrl` — base URL of the auth-core backend\n- `nextAuthSecret` — NextAuth.js secret for JWT signing\n- `dataStore` — user/token storage adapter\n- `userStore` — user lookup adapter\n- `pages` — custom page routes\n- `callbackRoutes` — redirect routes after auth events\n- `argon2` — custom argon2 instance\n- `googleClientId` / `googleClientSecret` — Google OAuth credentials\n\n---\n\n## Hooks\n\n### `useAuthForm({ mode, callbackUrl })`\nReturns: `{ register, handleSubmit, errors, isSubmitting, isGoogleLoading, onSubmit, handleGoogle, formError }`\n\n### `useVerifyEmail({ token })`\nReturns: `{ status, message }` — auto-verifies on mount.\n\n### `useForgetPasswordPage()`\nReturns: `{ error, success, register, handleSubmit, errors, isSubmitting, onSubmit }`\n\n### `useResetPasswordPage({ token })`\nReturns: `{ register, handleSubmit, errors, isSubmitting, error, success, onSubmit }`\n\n---\n\n## Components\n\n- `AuthPage` — full-screen login/register wrapper\n- `AuthForm` — form with header/fields/buttons/footer\n- `AuthFormSkeleton` — loading placeholder\n- `ForgotPasswordPage` — email input + success message\n- `ResetPasswordPage` — password + confirm inputs\n- `VerifyEmailPage` — auto-verify with status display\n\n---\n\n## API Handlers\n\n- `handleRegister(req, opts)` — register with Zod validation + argon2\n- `handleVerifyEmail(req, opts)` — verify email token\n- `handleForgotPassword(req, opts)` — send reset email\n- `handleResetPassword(req, opts)` — reset password with token",

    examples:
      "```tsx\n// Custom login form with hook\n'use client';\nimport { useAuthForm } from '@gablura/auth-next/hooks';\n\nexport function LoginForm() {\n  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useAuthForm({\n    mode: 'login',\n    callbackUrl: '/dashboard',\n  });\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input {...register('email')} />\n      {errors.email && <span>{errors.email.message}</span>}\n      <input type=\"password\" {...register('password')} />\n      <button type=\"submit\" disabled={isSubmitting}>Sign in</button>\n    </form>\n  );\n}\n```\n---\n```typescript\n// Custom API route for registration\nimport { handleRegister } from '@gablura/auth-next/api';\n\nexport async function POST(req: Request) {\n  return handleRegister(req, {\n    dataStore: mongoDataStore,\n    argon2,\n    sendVerificationEmail,\n    rateLimitKey: 'register',\n  });\n}\n```\n---\n```typescript\n// HMAC-signed internal API calls\nimport { callInternal } from '@gablura/auth-next';\n\nconst result = await callInternal({\n  url: 'http://localhost:3001/api/v1/internal/users/123',\n  hmacSecret: process.env.AUTH_HMAC_SECRET!,\n});\n```",

    changelog:
      "## 1.2.4\n- fix: token refresh dedup race condition\n- fix: Google OAuth profile type handling\n\n## 1.2.3\n- feat: add AuthFormSkeleton loading component\n- feat: composable form sub-components\n\n## 1.2.2\n- fix: session timeout detection in JWT callback\n- fix: email enumeration prevention in forgot-password\n\n## 1.2.1\n- feat: add useForgetPasswordPage hook\n- feat: add useResetPasswordPage hook\n\n## 1.2.0\n- feat: Google OAuth provider support\n- feat: TOTP two-factor authentication flow\n- feat: HMAC-signed backend bridge\n- feat: automatic token refresh (60s before expiry)\n- BREAKING: requires @gablura/auth-core backend\n\n## 1.1.0\n- feat: email verification flow\n- feat: password reset flow\n- feat: rate limiting on registration",
  },
};

async function seed() {
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    const db = client.db();

    const col = db.collection("packages");

    // Upsert auth-core
    const coreResult = await col.updateOne(
      { slug: "auth-core" },
      {
        $set: {
          ...AUTH_CORE,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(
      `auth-core: ${coreResult.upsertedCount ? "inserted" : "updated"}`
    );

    // Upsert auth-next
    const nextResult = await col.updateOne(
      { slug: "auth-next" },
      {
        $set: {
          ...AUTH_NEXT,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(
      `auth-next: ${nextResult.upsertedCount ? "inserted" : "updated"}`
    );

    console.log("Seed complete.");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
