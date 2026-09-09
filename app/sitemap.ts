import type { MetadataRoute } from "next";
import { getCachedPublishedByType } from "@/lib/resources";
import { getCachedPublishedProjects } from "@/lib/projects";

const BASE_URL = "https://gablura-org.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packages, tools, sdks, projects] = await Promise.all([
    getCachedPublishedByType("package"),
    getCachedPublishedByType("tool"),
    getCachedPublishedByType("sdk"),
    getCachedPublishedProjects(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/ecosystem`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sdks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [
    ...packages.map((pkg) => ({
      url: `${BASE_URL}/packages/${pkg.slug}`,
      lastModified: pkg.updatedAt ?? pkg.createdAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tools.map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: tool.updatedAt ?? tool.createdAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...sdks.map((sdk) => ({
      url: `${BASE_URL}/sdks/${sdk.slug}`,
      lastModified: sdk.updatedAt ?? sdk.createdAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: project.updatedAt ?? project.createdAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}
