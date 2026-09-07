import { createAuthOptions } from "@gablura/auth-next";
import { mongoDataStore, mongoUserStore } from "./data-store";

const hmacSecret = process.env.AUTH_HMAC_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export function getAuthOptions() {
  if (!hmacSecret) {
    throw new Error("Missing AUTH_HMAC_SECRET environment variable");
  }

  return createAuthOptions({
    hmacSecret,
    backendUrl: appUrl,
    nextAuthSecret: nextAuthSecret ?? "",
    dataStore: mongoDataStore,
    userStore: mongoUserStore,
    pages: {
      signIn: "/login",
    },
    callbackRoutes: {
      success: "/dashboard",
      login: "/login",
      register: "/register",
      verifyEmail: "/verify-email",
      forgotPassword: "/forgot-password",
      resetPassword: "/reset-password",
    },
  });
}
