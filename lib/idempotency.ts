import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface IdempotencyEntry {
  _id: string;
  userId: string;
  action: string;
  resourceId: string;
  createdAt: Date;
  expiresAt: Date;
}

const TTL_SECONDS = 86400; // 24 hours

function generateKey(userId: string, action: string, payload: string): string {
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.createHash("sha256").update(`${userId}:${action}:${payload}`).digest("hex");
}

export async function checkIdempotency(
  userId: string,
  action: string,
  payload: Record<string, unknown>
): Promise<{ isDuplicate: boolean; existingResourceId?: string }> {
  const db = await getDb();
  const col = db.collection<IdempotencyEntry>("idempotency_keys");

  const key = generateKey(userId, action, JSON.stringify(payload));

  const existing = await col.findOne({ _id: key });
  if (existing) {
    return { isDuplicate: true, existingResourceId: existing.resourceId };
  }

  return { isDuplicate: false };
}

export async function recordIdempotency(
  userId: string,
  action: string,
  payload: Record<string, unknown>,
  resourceId: string
): Promise<void> {
  const db = await getDb();
  const col = db.collection<IdempotencyEntry>("idempotency_keys");

  const key = generateKey(userId, action, JSON.stringify(payload));
  const now = new Date();

  await col.updateOne(
    { _id: key },
    {
      $set: {
        userId,
        action,
        resourceId,
        createdAt: now,
        expiresAt: new Date(now.getTime() + TTL_SECONDS * 1000),
      },
    },
    { upsert: true }
  );
}

export async function cleanupExpiredKeys(): Promise<number> {
  const db = await getDb();
  const col = db.collection<IdempotencyEntry>("idempotency_keys");

  const result = await col.deleteMany({
    expiresAt: { $lt: new Date() },
  });

  return result.deletedCount;
}
