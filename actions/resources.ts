"use server";

import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ROLE_HIERARCHY } from "@/types/roles";
import type { Role } from "@/types/roles";
import type {
  Resource,
  ResourceType,
  ResourceFormData,
  ResourceDocumentation,
} from "@/types/resources";
import { ObjectId } from "mongodb";

interface ResourceDoc {
  _id?: ObjectId;
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

async function authenticate() {
  const session = await getServerSession(await getAuthOptions());
  if (!session?.user) return null;
  return {
    id: session.user.id as string,
    name: (session.user.name ?? session.user.email?.split("@")[0]) as string,
    role: (session.user.role ?? "user") as Role,
  };
}

function canModify(callerId: string, callerRole: Role, resource: Resource): boolean {
  if (callerRole === "owner") return true;
  return resource.authorId === callerId;
}

export async function getResources(type: ResourceType) {
  const caller = await authenticate();
  if (!caller) return [];

  const col = await getCollection(type);
  const query: Record<string, unknown> =
    caller.role === "owner" ? {} : { authorId: caller.id };
  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(docToResource);
}

export async function createResource(type: ResourceType, data: ResourceFormData) {
  const caller = await authenticate();
  if (!caller) return { error: "Unauthorized" };

  if (ROLE_HIERARCHY[caller.role] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  if (!data.name.trim()) return { error: "Name is required" };

  const slug = data.slug.trim() || generateSlug(data.name);
  const now = new Date();

  const col = await getCollection(type);
  await col.insertOne({
    type,
    name: data.name.trim(),
    slug,
    description: data.description.trim(),
    version: data.version.trim() || "0.1.0",
    repositoryUrl: data.repositoryUrl.trim(),
    documentation: data.documentation,
    authorId: caller.id,
    authorName: caller.name,
    status: data.status,
    featured: data.featured,
    createdAt: now,
    updatedAt: now,
  });

  return { success: true };
}

export async function updateResource(
  type: ResourceType,
  resourceId: string,
  data: ResourceFormData
) {
  const caller = await authenticate();
  if (!caller) return { error: "Unauthorized" };

  if (ROLE_HIERARCHY[caller.role] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  const col = await getCollection(type);
  let doc: ResourceDoc | null;
  try {
    doc = await col.findOne({ _id: new ObjectId(resourceId) });
  } catch {
    return { error: "Invalid resource ID" };
  }

  if (!doc) return { error: "Resource not found" };

  if (!canModify(caller.id, caller.role, docToResource(doc))) {
    return { error: "You can only edit your own resources" };
  }

  if (!data.name.trim()) return { error: "Name is required" };

  await col.updateOne(
    { _id: new ObjectId(resourceId) },
    {
      $set: {
        name: data.name.trim(),
        description: data.description.trim(),
        version: data.version.trim() || "0.1.0",
        repositoryUrl: data.repositoryUrl.trim(),
        documentation: data.documentation,
        status: data.status,
        featured: data.featured,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true };
}

export async function deleteResource(type: ResourceType, resourceId: string) {
  const caller = await authenticate();
  if (!caller) return { error: "Unauthorized" };

  if (ROLE_HIERARCHY[caller.role] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  const col = await getCollection(type);
  let doc: ResourceDoc | null;
  try {
    doc = await col.findOne({ _id: new ObjectId(resourceId) });
  } catch {
    return { error: "Invalid resource ID" };
  }

  if (!doc) return { error: "Resource not found" };

  if (!canModify(caller.id, caller.role, docToResource(doc))) {
    return { error: "You can only delete your own resources" };
  }

  await col.deleteOne({ _id: new ObjectId(resourceId) });
  return { success: true };
}
