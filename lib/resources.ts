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
  const col4 = await getCollection("project");
  const [packages, tools, sdks, projects] = await Promise.all([
    col1.countDocuments({ status: "published" }),
    col2.countDocuments({ status: "published" }),
    col3.countDocuments({ status: "published" }),
    col4.countDocuments({ status: "published" }),
  ]);
  return { package: packages, tool: tools, sdk: sdks, project: projects };
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
    return (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0);
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

export function getCachedPublishedByType(type: ResourceType) {
  return cache(
    () => getPublishedResources(type),
    ["resources", type],
    { revalidate: 60, tags: ["resources"] }
  )();
}

async function getResourceBySlug(
  type: ResourceType,
  slug: string
): Promise<Resource | null> {
  const col = await getCollection(type);
  const doc = await col.findOne({ slug, status: "published" });
  return doc ? docToResource(doc) : null;
}

export function getCachedResourceBySlug(type: ResourceType, slug: string) {
  return cache(
    () => getResourceBySlug(type, slug),
    ["resource", type, slug],
    { revalidate: 60, tags: ["resources"] }
  )();
}

async function getRelatedResources(
  type: ResourceType,
  currentSlug: string,
  limit: number = 3
): Promise<Resource[]> {
  const col = await getCollection(type);
  const docs = await col
    .find({ status: "published", slug: { $ne: currentSlug } })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(docToResource);
}

export function getCachedRelatedResources(
  type: ResourceType,
  currentSlug: string
) {
  return cache(
    () => getRelatedResources(type, currentSlug),
    ["related", type, currentSlug],
    { revalidate: 60, tags: ["resources"] }
  )();
}

async function getFeaturedResources(
  limit: number = 6
): Promise<Resource[]> {
  const types: ResourceType[] = ["package", "sdk", "tool"];
  const results = await Promise.all(
    types.map((type) => getPublishedResources(type))
  );
  const all = results.flat();
  all.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0);
  });
  return all.slice(0, limit);
}

export const getCachedFeaturedResources = cache(
  () => getFeaturedResources(6),
  ["ecosystem", "featured-resources"],
  { revalidate: 60, tags: ["resources"] }
);
