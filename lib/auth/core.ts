import { readFileSync } from "fs";
import { join } from "path";
import { AuthService } from "@gablura/auth-core";
import { redisAdapter } from "./redis";
import { mongoUserStore } from "./data-store";

const hmacSecret = process.env.AUTH_HMAC_SECRET;
if (!hmacSecret) throw new Error("Missing AUTH_HMAC_SECRET");

const keysDir = join(process.cwd(), "keys");
const privateKey = readFileSync(join(keysDir, "private.pem"), "utf-8");
const publicKey = readFileSync(join(keysDir, "public.pem"), "utf-8");

const authService = new AuthService({
  redis: redisAdapter,
  userStore: mongoUserStore,
  hmacSecret,
  jwt: {
    privateKey,
    publicKey,
    issuer: "gablura",
    audience: "gablura-app",
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
    sseTokenExpiry: "30s",
  },
  lockout: {
    maxFailures: 5,
    lockoutSeconds: 900,
    windowSeconds: 900,
  },
  session: {
    maxConcurrent: 5,
    inactivityTimeout: 3600,
    absoluteTimeout: 86400,
  },
});

export { authService };
