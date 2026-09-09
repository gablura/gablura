import { docToProject, getProjectsCollection } from "@/lib/resource-helpers";
import type { Project } from "@/types/projects";
import { unstable_cache as cache } from "next/cache";

async function getPublishedProjects(): Promise<Project[]> {
  const col = await getProjectsCollection();
  const docs = await col
    .find({ status: { $ne: "archived" } })
    .sort({ featured: -1, createdAt: -1 })
    .toArray();
  return docs.map(docToProject);
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  const col = await getProjectsCollection();
  const doc = await col.findOne({ slug });
  return doc ? docToProject(doc) : null;
}

async function getFeaturedProject(): Promise<Project | null> {
  const col = await getProjectsCollection();
  const doc = await col.findOne(
    { featured: true },
    { sort: { createdAt: -1 } }
  );
  if (doc) return docToProject(doc);

  const fallback = await col.findOne({}, { sort: { createdAt: -1 } });
  return fallback ? docToProject(fallback) : null;
}

async function getProjectCounts(): Promise<{
  total: number;
  active: number;
  "in-development": number;
}> {
  const col = await getProjectsCollection();
  const [total, active, inDevelopment] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments({ status: "active" }),
    col.countDocuments({ status: "in-development" }),
  ]);
  return { total, active, "in-development": inDevelopment };
}

export const getCachedPublishedProjects = cache(
  () => getPublishedProjects(),
  ["projects", "published"],
  { revalidate: 60, tags: ["projects"] }
);

export const getCachedProjectBySlug = (slug: string) =>
  cache(
    () => getProjectBySlug(slug),
    ["project", slug],
    { revalidate: 60, tags: ["projects"] }
  )();

export const getCachedFeaturedProject = cache(
  () => getFeaturedProject(),
  ["projects", "featured"],
  { revalidate: 60, tags: ["projects"] }
);

export const getCachedProjectCounts = cache(
  () => getProjectCounts(),
  ["projects", "counts"],
  { revalidate: 60, tags: ["projects"] }
);
