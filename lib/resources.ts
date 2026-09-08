import { docToResource, getCollection } from "@/lib/resource-helpers";
import type { Resource, ResourceType } from "@/types/resources";
import { unstable_cache as cache } from "next/cache";

async function getPublishedResources(type: ResourceType): Promise<Resource[]> {
  const col = await getCollection(type);
  const docs = await col
    .find({ status: "published" })
    .sort({ featured: -1, createdAt: -1 })
    .toArray();
  return docs.map(docToResource);
}

async function getFeaturedPackage(): Promise<Resource | null> {
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

async function getPublishedCounts(): Promise<Record<ResourceType, number>> {
  const col1 = await getCollection("package");
  const col2 = await getCollection("tool");
  const col3 = await getCollection("sdk");
  const [packages, tools, sdks] = await Promise.all([
    col1.countDocuments({ status: "published" }),
    col2.countDocuments({ status: "published" }),
    col3.countDocuments({ status: "published" }),
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
