import { ObjectId } from "mongodb";
import { getCollection, docToResource, type ResourceDoc } from "@/lib/resource-helpers";
import type { ResourceType } from "@/types/resources";

export async function findByTypeAndQuery(
  type: ResourceType,
  query: Record<string, unknown>
) {
  const col = await getCollection(type);
  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(docToResource);
}

export async function findById(type: ResourceType, id: string) {
  const col = await getCollection(type);
  let doc: ResourceDoc | null;
  try {
    doc = await col.findOne({ _id: new ObjectId(id) }) as ResourceDoc | null;
  } catch {
    return null;
  }
  return doc ? docToResource(doc) : null;
}

export async function findRawById(type: ResourceType, id: string) {
  const col = await getCollection(type);
  try {
    return await col.findOne({ _id: new ObjectId(id) }) as ResourceDoc | null;
  } catch {
    return null;
  }
}

export async function insert(type: ResourceType, data: Omit<ResourceDoc, "_id">) {
  const col = await getCollection(type);
  const result = await col.insertOne(data);
  return result.insertedId.toString();
}

export async function updateById(
  type: ResourceType,
  id: string,
  data: Partial<Omit<ResourceDoc, "_id">>
) {
  const col = await getCollection(type);
  await col.updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteById(type: ResourceType, id: string) {
  const col = await getCollection(type);
  await col.deleteOne({ _id: new ObjectId(id) });
}

export async function findBySlug(type: ResourceType, slug: string) {
  const col = await getCollection(type);
  const doc = await col.findOne({ slug }) as ResourceDoc | null;
  return doc ? docToResource(doc) : null;
}
