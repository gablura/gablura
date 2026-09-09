"use server";

import { ROLE_HIERARCHY } from "@/types/roles";
import type { ProjectFormData } from "@/types/projects";
import { authenticate, canModify, buildRoleQuery } from "@/lib/auth-helpers";
import { docToProject, getProjectsCollection, type ProjectDoc } from "@/lib/resource-helpers";
import { generateSlug } from "@/lib/slug";
import { ObjectId } from "mongodb";

export async function getProjects() {
  const caller = await authenticate();
  if (!caller) return [];

  const col = await getProjectsCollection();
  const query = buildRoleQuery(caller.role, caller.id);
  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(docToProject);
}

export async function createProject(data: ProjectFormData) {
  const caller = await authenticate();
  if (!caller) return { error: "Unauthorized" };

  if (ROLE_HIERARCHY[caller.role] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  if (!data.name.trim()) return { error: "Name is required" };

  const slug = data.slug.trim() || generateSlug(data.name);
  const techStack = data.techStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const now = new Date();

  const col = await getProjectsCollection();
  await col.insertOne({
    name: data.name.trim(),
    slug,
    tagline: data.tagline.trim(),
    description: data.description.trim(),
    techStack,
    frontendUrl: data.frontendUrl.trim(),
    backendUrl: data.backendUrl.trim(),
    repositoryUrl: data.repositoryUrl.trim(),
    imageUrl: data.imageUrl.trim(),
    featured: data.featured,
    status: data.status,
    authorId: caller.id,
    authorName: caller.name,
    createdAt: now,
    updatedAt: now,
  });

  return { success: true };
}

export async function updateProject(projectId: string, data: ProjectFormData) {
  const caller = await authenticate();
  if (!caller) return { error: "Unauthorized" };

  if (ROLE_HIERARCHY[caller.role] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  const col = await getProjectsCollection();
  let doc: ProjectDoc | null;
  try {
    doc = await col.findOne({ _id: new ObjectId(projectId) }) as ProjectDoc | null;
  } catch {
    return { error: "Invalid project ID" };
  }

  if (!doc) return { error: "Project not found" };

  if (!canModify(caller.role, caller.id, docToProject(doc).authorId)) {
    return { error: "You can only edit your own projects" };
  }

  if (!data.name.trim()) return { error: "Name is required" };

  const techStack = data.techStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await col.updateOne(
    { _id: new ObjectId(projectId) },
    {
      $set: {
        name: data.name.trim(),
        tagline: data.tagline.trim(),
        description: data.description.trim(),
        techStack,
        frontendUrl: data.frontendUrl.trim(),
        backendUrl: data.backendUrl.trim(),
        repositoryUrl: data.repositoryUrl.trim(),
        imageUrl: data.imageUrl.trim(),
        featured: data.featured,
        status: data.status,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true };
}

export async function deleteProject(projectId: string) {
  const caller = await authenticate();
  if (!caller) return { error: "Unauthorized" };

  if (ROLE_HIERARCHY[caller.role] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  const col = await getProjectsCollection();
  let doc: ProjectDoc | null;
  try {
    doc = await col.findOne({ _id: new ObjectId(projectId) }) as ProjectDoc | null;
  } catch {
    return { error: "Invalid project ID" };
  }

  if (!doc) return { error: "Project not found" };

  if (!canModify(caller.role, caller.id, docToProject(doc).authorId)) {
    return { error: "You can only delete your own projects" };
  }

  await col.deleteOne({ _id: new ObjectId(projectId) });
  return { success: true };
}
