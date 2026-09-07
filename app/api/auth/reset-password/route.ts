import { handleResetPassword } from "@gablura/auth-next/api";
import { mongoDataStore } from "@/lib/auth/data-store";
import argon2 from "argon2";

export async function POST(req: Request) {
  return handleResetPassword(req, {
    dataStore: mongoDataStore,
    argon2: { hash: (pwd) => argon2.hash(pwd) },
  });
}
