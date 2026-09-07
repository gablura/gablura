import { getDb } from "@/lib/mongodb";
import type { Resource, ResourceType, ResourceDocumentation } from "@/types/resources";
import { unstable_cache as cache } from "next/cache";

interface ResourceDoc {
  _id: { toString(): string };
  type: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  repositoryUrl: string;
  documentation: ResourceDocumentation;
  authorId: string;
  authorName: string;
  status: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function docToResource(doc: ResourceDoc): Resource {
  return {
    id: doc._id.toString(),
    type: doc.type as ResourceType,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    version: doc.version,
    repositoryUrl: doc.repositoryUrl,
    documentation: doc.documentation,
    authorId: doc.authorId,
    authorName: doc.authorName,
    status: doc.status as "draft" | "published",
    featured: doc.featured,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

async function getCollection(type: ResourceType) {
  const db = await getDb();
  const collections: Record<ResourceType, string> = {
    package: "packages",
    tool: "tools",
    sdk: "sdks",
  };
  return db.collection<ResourceDoc>(collections[type]);
}

export async function getPublishedResources(type: ResourceType): Promise<Resource[]> {
  const col = await getCollection(type);
  const docs = await col
    .find({ status: "published" })
    .sort({ featured: -1, createdAt: -1 })
    .toArray();
  return docs.map(docToResource);
}

export async function getFeaturedPackage(): Promise<Resource | null> {
  const col = await getCollection("package");
  const doc = await col.findOne(
    { status: "published", featured: true },
    { sort: { createdAt: -1 } }
  );
  if (doc) return docToResource(doc);

  const fallback = await col.findOne(
    { status: "published" },
    { sort: { createdAt: -1 } }
  );
  return fallback ? docToResource(fallback) : null;
}

export async function getPublishedCounts(): Promise<Record<ResourceType, number>> {
  const db = await getDb();
  const [packages, tools, sdks] = await Promise.all([
    db.collection("packages").countDocuments({ status: "published" }),
    db.collection("tools").countDocuments({ status: "published" }),
    db.collection("sdks").countDocuments({ status: "published" }),
  ]);
  return { package: packages, tool: tools, sdk: sdks };
}

export async function getLatestResources(
  types: ResourceType[],
  limit: number = 6
): Promise<Resource[]> {
  const results = await Promise.all(
    types.map((type) => getPublishedResources(type))
  );
  const all = results.flat();
  all.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  return all.slice(0, limit);
}

export const getCachedPublishedCounts = cache(
  () => getPublishedCounts(),
  ["home", "published-counts"],
  { revalidate: 60, tags: ["resources"] }
);

export const getCachedFeaturedPackage = cache(
  () => getFeaturedPackage(),
  ["home", "featured-package"],
  { revalidate: 60, tags: ["resources"] }
);

export const getCachedLatestPackages = cache(
  () => getPublishedResources("package"),
  ["home", "latest-packages"],
  { revalidate: 60, tags: ["resources"] }
);
