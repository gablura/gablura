import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/types/roles";
import { ROLE_HIERARCHY } from "@/types/roles";

export interface SessionUser {
  id: string;
  name: string;
  role: Role;
}

/**
 * Get the current session. Returns null if not authenticated.
 * Use in Server Actions.
 */
export async function authenticate(): Promise<SessionUser | null> {
  const session = await getServerSession(await getAuthOptions());
  if (!session?.user) return null;
  return {
    id: session.user.id as string,
    name: (session.user.name ?? session.user.email?.split("@")[0]) as string,
    role: (session.user.role ?? "user") as Role,
  };
}

/**
 * Require an authenticated session. Redirects to /login if not found.
 * Use in dashboard Server Components.
 */
export async function requireSession() {
  const session = await getServerSession(await getAuthOptions());
  if (!session) redirect("/login");
  return session;
}

/**
 * Get a dashboard session with role guard.
 * Redirects to /login if not authenticated.
 * Redirects to /dashboard if role is below minimumRequired.
 */
export async function getDashboardSession(
  minimumRequired: Role = "admin"
) {
  const session = await requireSession();
  const userRole = (session.user?.role ?? "user") as Role;

  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minimumRequired]) {
    redirect("/dashboard");
  }

  return {
    session,
    userRole,
    userId: session.user?.id as string,
  };
}

/**
 * Check if the caller can modify a resource.
 * Owner can modify anything. Others can only modify their own.
 */
export function canModify(
  callerRole: Role,
  callerId: string,
  resourceAuthorId: string
): boolean {
  if (callerRole === "owner") return true;
  return resourceAuthorId === callerId;
}

/**
 * Build a MongoDB query based on caller role.
 * Owner sees everything. Admin sees own + system. Others see own only.
 */
export function buildRoleQuery(
  callerRole: Role,
  callerId: string
): Record<string, unknown> {
  if (callerRole === "owner") return {};
  if (callerRole === "admin") {
    return { $or: [{ authorId: callerId }, { authorId: "system" }] };
  }
  return { authorId: callerId };
}
