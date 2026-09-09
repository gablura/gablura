import { getDb } from "@/lib/mongodb";
import type { DeveloperRegistrationFormData } from "../schemas/developer.schema";

export interface DeveloperRecord {
  _id?: import("mongodb").ObjectId;
  name: string;
  email: string;
  nationality: string;
  primaryStack: string;
  secondaryStack: string;
  proficiency: string;
  githubUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  projectLinks: string;
  bio: string;
  motivation: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = "developers";

export const developerRepository = {
  async findByEmail(email: string): Promise<DeveloperRecord | null> {
    const db = await getDb();
    return db
      .collection<DeveloperRecord>(COLLECTION)
      .findOne({ email: email.toLowerCase() });
  },

  async create(data: DeveloperRegistrationFormData): Promise<DeveloperRecord> {
    const db = await getDb();
    const now = new Date();
    const record: DeveloperRecord = {
      name: data.name,
      email: data.email.toLowerCase(),
      nationality: data.nationality,
      primaryStack: data.primaryStack,
      secondaryStack: data.secondaryStack ?? "",
      proficiency: data.proficiency,
      githubUrl: data.githubUrl ?? "",
      portfolioUrl: data.portfolioUrl ?? "",
      linkedinUrl: data.linkedinUrl ?? "",
      projectLinks: data.projectLinks ?? "",
      bio: data.bio ?? "",
      motivation: data.motivation,
      experience: data.experience ?? "",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<DeveloperRecord>(COLLECTION)
      .insertOne(record);

    return { ...record, _id: result.insertedId };
  },

  async findAll(): Promise<DeveloperRecord[]> {
    const db = await getDb();
    return db
      .collection<DeveloperRecord>(COLLECTION)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  },

  async count(): Promise<number> {
    const db = await getDb();
    return db.collection(COLLECTION).countDocuments();
  },

  async countByStatus(): Promise<Record<string, number>> {
    const db = await getDb();
    const pipeline = [
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ];
    const results = await db
      .collection(COLLECTION)
      .aggregate(pipeline)
      .toArray();

    const counts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    for (const r of results) {
      counts[r._id as string] = r.count;
    }
    return counts;
  },
};
