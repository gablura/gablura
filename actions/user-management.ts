"use server";

import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { mongoUserStore } from "@/lib/auth";
import { ROLE_HIERARCHY, ROLES } from "@/types/roles";
import type { Role } from "@/types/roles";

const VALID_ROLES = Object.values(ROLES) as string[];

export async function changeUserRole(userId: string, newRole: string) {
  const session = await getServerSession(await getAuthOptions());
  if (!session?.user) return { error: "Unauthorized" };

  const callerRole = (session.user.role ?? "user") as Role;
  if (ROLE_HIERARCHY[callerRole] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  if (!VALID_ROLES.includes(newRole)) {
    return { error: "Invalid role" };
  }

  const target = await mongoUserStore.findById(userId);
  if (!target) return { error: "User not found" };

  if (target.id === session.user.id) {
    return { error: "Cannot change your own role" };
  }

  if (
    target.role === ROLES.OWNER &&
    callerRole !== ROLES.OWNER
  ) {
    return { error: "Only the owner can change the owner role" };
  }

  if (
    ROLE_HIERARCHY[newRole as Role] >= ROLE_HIERARCHY[callerRole] &&
    callerRole !== ROLES.OWNER
  ) {
    return { error: "Cannot assign a role equal to or higher than your own" };
  }

  await mongoUserStore.update(userId, { role: newRole });
  return { success: true };
}

export async function toggleUserBan(userId: string) {
  const session = await getServerSession(await getAuthOptions());
  if (!session?.user) return { error: "Unauthorized" };

  const callerRole = (session.user.role ?? "user") as Role;
  if (ROLE_HIERARCHY[callerRole] < ROLE_HIERARCHY.admin) {
    return { error: "Insufficient permissions" };
  }

  const target = await mongoUserStore.findById(userId);
  if (!target) return { error: "User not found" };

  if (target.id === session.user.id) {
    return { error: "Cannot ban yourself" };
  }

  if (
    target.role === ROLES.OWNER &&
    callerRole !== ROLES.OWNER
  ) {
    return { error: "Only the owner can ban the owner" };
  }

  const bannedAt = target.bannedAt ? null : new Date();
  await mongoUserStore.update(userId, { bannedAt });
  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(await getAuthOptions());
  if (!session?.user) return { error: "Unauthorized" };

  const callerRole = (session.user.role ?? "user") as Role;
  if (callerRole !== ROLES.OWNER) {
    return { error: "Only the owner can delete users" };
  }

  const target = await mongoUserStore.findById(userId);
  if (!target) return { error: "User not found" };

  if (target.id === session.user.id) {
    return { error: "Cannot delete yourself" };
  }

  await mongoUserStore.update(userId, { bannedAt: new Date() });
  return { success: true };
}
