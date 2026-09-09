import { ObjectId } from "mongodb";
import { getProjectsCollection, docToProject, type ProjectDoc } from "@/lib/resource-helpers";

export async function findByQuery(query: Record<string, unknown>) {
  const col = await getProjectsCollection();
  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(docToProject);
}

export async function findById(id: string) {
  const col = await getProjectsCollection();
  let doc: ProjectDoc | null;
  try {
    doc = await col.findOne({ _id: new ObjectId(id) }) as ProjectDoc | null;
  } catch {
    return null;
  }
  return doc ? docToProject(doc) : null;
}

export async function findRawById(id: string) {
  const col = await getProjectsCollection();
  try {
    return await col.findOne({ _id: new ObjectId(id) }) as ProjectDoc | null;
  } catch {
    return null;
  }
}

export async function insert(data: Omit<ProjectDoc, "_id">) {
  const col = await getProjectsCollection();
  const result = await col.insertOne(data);
  return result.insertedId.toString();
}

export async function updateById(id: string, data: Partial<Omit<ProjectDoc, "_id">>) {
  const col = await getProjectsCollection();
  await col.updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteById(id: string) {
  const col = await getProjectsCollection();
  await col.deleteOne({ _id: new ObjectId(id) });
}

export async function findBySlug(slug: string) {
  const col = await getProjectsCollection();
  const doc = await col.findOne({ slug }) as ProjectDoc | null;
  return doc ? docToProject(doc) : null;
}
