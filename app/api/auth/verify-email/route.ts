import { handleVerifyEmail } from "@gablura/auth-next/api";
import { mongoDataStore } from "@/lib/auth/data-store";

export async function POST(req: Request) {
  return handleVerifyEmail(req, {
    dataStore: mongoDataStore,
  });
}
