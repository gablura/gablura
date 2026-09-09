import type { Role } from "@/types/roles";
import { ROLE_HIERARCHY } from "@/types/roles";

export type Permission =
  | "resources.read"
  | "resources.write"
  | "resources.delete"
  | "projects.read"
  | "projects.write"
  | "projects.delete"
  | "users.read"
  | "users.write"
  | "users.delete"
  | "audit.read";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    "resources.read",
    "resources.write",
    "resources.delete",
    "projects.read",
    "projects.write",
    "projects.delete",
    "users.read",
    "users.write",
    "users.delete",
    "audit.read",
  ],
  admin: [
    "resources.read",
    "resources.write",
    "resources.delete",
    "projects.read",
    "projects.write",
    "projects.delete",
    "users.read",
  ],
  moderator: ["resources.read", "projects.read", "users.read"],
  user: ["resources.read", "projects.read"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Insufficient permissions: requires ${permission}`);
  }
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function canAllocateRole(
  callerRole: Role,
  targetRole: Role
): boolean {
  if (callerRole === "owner") return true;
  return ROLE_HIERARCHY[callerRole] > ROLE_HIERARCHY[targetRole];
}
