import { getDb } from "@/lib/mongodb";
import type { IndexSpecification } from "mongodb";

const UNIQUE_INDEXES: { collection: string; key: IndexSpecification; name: string }[] = [
  { collection: "packages", key: { slug: 1 }, name: "packages_slug_unique" },
  { collection: "sdks", key: { slug: 1 }, name: "sdks_slug_unique" },
  { collection: "tools", key: { slug: 1 }, name: "tools_slug_unique" },
  { collection: "projects", key: { slug: 1 }, name: "projects_slug_unique" },
  { collection: "messages", key: { email: 1, createdAt: -1 }, name: "messages_email_created" },
];

export async function ensureIndexes() {
  const db = await getDb();

  for (const idx of UNIQUE_INDEXES) {
    const col = db.collection(idx.collection);
    try {
      await col.createIndex(idx.key, { unique: true, name: idx.name });
    } catch (err) {
      console.error(`[ensureIndexes] Failed to create index ${idx.name}:`, err);
    }
  }
}

if (require.main === module) {
  ensureIndexes()
    .then(() => {
      console.log("[ensureIndexes] Done");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[ensureIndexes] Fatal:", err);
      process.exit(1);
    });
}
