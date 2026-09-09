import { ObjectId } from "mongodb";
import { mongoUserStore } from "@/lib/auth";
import type { Role } from "@/types/roles";
import { ROLE_HIERARCHY } from "@/types/roles";
import { logAudit } from "@/lib/audit-log";

export interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  bannedAt: Date | null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const user = await mongoUserStore.findById(id);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
    role: (user.role ?? "user") as Role,
    bannedAt: user.bannedAt ?? null,
  };
}

export async function changeRole(
  callerId: string,
  callerRole: Role,
  targetId: string,
  newRole: string
): Promise<{ success: boolean; error?: string }> {
  const validRoles = ["user", "moderator", "admin", "owner"];
  if (!validRoles.includes(newRole)) {
    return { success: false, error: "Invalid role" };
  }

  const target = await mongoUserStore.findById(targetId);
  if (!target) return { success: false, error: "User not found" };

  if (target.id === callerId) {
    return { success: false, error: "Cannot change your own role" };
  }

  if (target.role === "owner" && callerRole !== "owner") {
    return { success: false, error: "Only the owner can change the owner role" };
  }

  if (
    ROLE_HIERARCHY[newRole as Role] >= ROLE_HIERARCHY[callerRole] &&
    callerRole !== "owner"
  ) {
    return { success: false, error: "Cannot assign a role equal to or higher than your own" };
  }

  await mongoUserStore.update(targetId, { role: newRole });

  logAudit({
    actor: callerId,
    action: "ROLE_CHANGED",
    resource: "user",
    resourceId: targetId,
    metadata: { newRole, previousRole: target.role },
  });

  return { success: true };
}

export async function toggleBan(
  callerId: string,
  callerRole: Role,
  targetId: string
): Promise<{ success: boolean; banned?: boolean; error?: string }> {
  const target = await mongoUserStore.findById(targetId);
  if (!target) return { success: false, error: "User not found" };

  if (target.id === callerId) {
    return { success: false, error: "Cannot ban yourself" };
  }

  if (target.role === "owner" && callerRole !== "owner") {
    return { success: false, error: "Only the owner can ban the owner" };
  }

  const bannedAt = target.bannedAt ? null : new Date();
  await mongoUserStore.update(targetId, { bannedAt });

  logAudit({
    actor: callerId,
    action: bannedAt ? "USER_BANNED" : "USER_UNBANNED",
    resource: "user",
    resourceId: targetId,
  });

  return { success: true, banned: !!bannedAt };
}

export async function ban(
  callerId: string,
  callerRole: Role,
  targetId: string
): Promise<{ success: boolean; error?: string }> {
  if (callerRole !== "owner") {
    return { success: false, error: "Only the owner can delete users" };
  }

  const target = await mongoUserStore.findById(targetId);
  if (!target) return { success: false, error: "User not found" };

  if (target.id === callerId) {
    return { success: false, error: "Cannot delete yourself" };
  }

  await mongoUserStore.update(targetId, { bannedAt: new Date() });

  logAudit({
    actor: callerId,
    action: "USER_BANNED",
    resource: "user",
    resourceId: targetId,
  });

  return { success: true };
}
