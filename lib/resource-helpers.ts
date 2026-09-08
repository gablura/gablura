import { getDb } from "@/lib/mongodb";
import type { Resource, ResourceType, ResourceDocumentation } from "@/types/resources";
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
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
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
