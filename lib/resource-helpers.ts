import { getDb } from "@/lib/mongodb";
import type { Resource, ResourceType, ResourceDocumentation } from "@/types/resources";
import type { Project, ProjectStatus } from "@/types/projects";
import { type OptionalId } from "mongodb";

export type ResourceDoc = OptionalId<{
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
}>;

export type ProjectDoc = OptionalId<{
  name: string;
  slug: string;
  tagline: string;
  description: string;
  techStack: string[];
  frontendUrl: string;
  backendUrl: string;
  repositoryUrl: string;
  imageUrl: string;
  featured: boolean;
  status: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export function docToResource(doc: ResourceDoc): Resource {
  return {
    id: doc._id!.toString(),
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
    createdAt: doc.createdAt ?? new Date(),
    updatedAt: doc.updatedAt ?? new Date(),
  };
}

export function docToProject(doc: ProjectDoc): Project {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    slug: doc.slug,
    tagline: doc.tagline,
    description: doc.description,
    techStack: doc.techStack,
    frontendUrl: doc.frontendUrl,
    backendUrl: doc.backendUrl,
    repositoryUrl: doc.repositoryUrl,
    imageUrl: doc.imageUrl,
    featured: doc.featured,
    status: doc.status as ProjectStatus,
    authorId: doc.authorId,
    authorName: doc.authorName,
    createdAt: doc.createdAt ?? new Date(),
    updatedAt: doc.updatedAt ?? new Date(),
  };
}

export async function getCollection(type: ResourceType) {
  const db = await getDb();
  const collections: Record<ResourceType, string> = {
    package: "packages",
    tool: "tools",
    sdk: "sdks",
  };
  return db.collection<ResourceDoc>(collections[type]);
}

export async function getProjectsCollection() {
  const db = await getDb();
  return db.collection<ProjectDoc>("projects");
}
