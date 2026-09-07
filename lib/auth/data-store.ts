import { getDb } from "@/lib/mongodb";
import type { DataStore } from "@gablura/auth-next";
import { ObjectId } from "mongodb";

async function users() {
  return (await getDb()).collection("users");
}

async function verificationTokens() {
  return (await getDb()).collection("verification_tokens");
}

async function passwordResetTokens() {
  return (await getDb()).collection("password_reset_tokens");
}

export const mongoDataStore: DataStore = {
  async findUserByEmail(email) {
    const col = await users();
    const user = await col.findOne({ email });
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name ?? null,
      password: user.password ?? null,
      emailVerified: user.emailVerified ?? null,
    };
  },

  async createUser(data) {
    const col = await users();
    const result = await col.insertOne({
      name: data.name ?? null,
      email: data.email,
      password: data.password ?? null,
      emailVerified: null,
      role: "admin",
      twoFactorEnabled: false,
      twoFactorSecret: null,
      image: null,
      lastLoginAt: null,
      bannedAt: null,
      banReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: result.insertedId.toString() };
  },

  async updateUserByEmail(email, data) {
    const col = await users();
    const $set: Record<string, unknown> = { ...data, updatedAt: new Date() };
    await col.updateOne({ email }, { $set });
  },

  async createVerificationToken(data) {
    const col = await verificationTokens();
    await col.insertOne({
      identifier: data.identifier,
      token: data.token,
      expires: data.expires,
      createdAt: new Date(),
    });
  },

  async findVerificationToken(token) {
    const col = await verificationTokens();
    const record = await col.findOne({ token });
    if (!record) return null;
    return { identifier: record.identifier, expires: record.expires };
  },

  async deleteVerificationToken(token, identifier) {
    const col = await verificationTokens();
    await col.deleteOne({ token, identifier });
  },

  async createPasswordResetToken(data) {
    const col = await passwordResetTokens();
    await col.insertOne({
      email: data.email,
      token: data.token,
      expires: data.expires,
      createdAt: new Date(),
    });
  },

  async findPasswordResetToken(token) {
    const col = await passwordResetTokens();
    const record = await col.findOne({ token });
    if (!record) return null;
    return { email: record.email, token: record.token };
  },

  async deletePasswordResetToken(email) {
    const col = await passwordResetTokens();
    await col.deleteOne({ email });
  },
};

export const mongoUserStore = {
  async findByEmail(email: string) {
    const col = await users();
    const user = await col.findOne({ email });
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name ?? null,
      role: user.role ?? "admin",
      password: user.password ?? null,
      emailVerified: user.emailVerified ?? null,
      twoFactorEnabled: user.twoFactorEnabled ?? false,
      twoFactorSecret: user.twoFactorSecret ?? null,
      image: user.image ?? null,
      lastLoginAt: user.lastLoginAt ?? null,
      bannedAt: user.bannedAt ?? null,
      banReason: user.banReason ?? null,
    };
  },

  async findById(id: string) {
    const col = await users();
    let user;
    try {
      user = await col.findOne({ _id: new ObjectId(id) });
    } catch {
      return null;
    }
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name ?? null,
      role: user.role ?? "admin",
      twoFactorEnabled: user.twoFactorEnabled ?? false,
      emailVerified: user.emailVerified ?? null,
      bannedAt: user.bannedAt ?? null,
      banReason: user.banReason ?? null,
    };
  },

  async update(id: string, data: Record<string, unknown>) {
    const col = await users();
    try {
      await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
    } catch {
      // ignore
    }
  },

  async updateEmailVerified(id: string, verified: Date) {
    const col = await users();
    try {
      await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: { emailVerified: verified, updatedAt: new Date() } }
      );
    } catch {
      // ignore
    }
  },
};
