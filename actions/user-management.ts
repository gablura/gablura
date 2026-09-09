"use server";

import { revalidatePath } from "next/cache";
import { authenticate } from "@/lib/auth-helpers";
import { hasPermission } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";
import { startTrace, endTrace, structuredLog } from "@/lib/trace";
import { ROLES } from "@/types/roles";
import * as userService from "@/features/users/services/user-service";
import type { ActionResult } from "@/types/action-result";

const VALID_ROLES = Object.values(ROLES) as string[];

export async function changeUserRole(
  userId: string,
  newRole: string
): Promise<ActionResult<{ id: string }>> {
  const trace = startTrace();
  try {
    // 1. Authentication
    const caller = await authenticate();
    if (!caller) {
      return {
        success: false,
        code: "UNAUTHORIZED",
        error: "You must be signed in",
      };
    }

    // 2. Authorization
    if (!hasPermission(caller.role, "users.write")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`role-change:${caller.id}`, "write-heavy");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Input validation
    if (!VALID_ROLES.includes(newRole)) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Invalid role",
      };
    }

    // 5. Service call
    const result = await userService.changeRole(caller.id, caller.role, userId, newRole);
    if (!result.success) {
      return {
        success: false,
        code: result.error === "User not found" ? "NOT_FOUND" : "FORBIDDEN",
        error: result.error!,
      };
    }

    // 6. Cache revalidation
    revalidatePath("/dashboard/users");

    // 7. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "changeUserRole",
      userId: caller.id,
      resourceId: userId,
      durationMs,
      message: "User role changed",
    });
    return { success: true, data: { id: userId } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "changeUserRole",
      durationMs,
      message: "Failed to change user role",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[changeUserRole]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to change user role",
    };
  }
}

export async function toggleUserBan(
  userId: string
): Promise<ActionResult<{ id: string; banned: boolean }>> {
  const trace = startTrace();
  try {
    // 1. Authentication
    const caller = await authenticate();
    if (!caller) {
      return {
        success: false,
        code: "UNAUTHORIZED",
        error: "You must be signed in",
      };
    }

    // 2. Authorization
    if (!hasPermission(caller.role, "users.write")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`ban-toggle:${caller.id}`, "write-heavy");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Service call
    const result = await userService.toggleBan(caller.id, caller.role, userId);
    if (!result.success) {
      return {
        success: false,
        code: result.error === "User not found" ? "NOT_FOUND" : "FORBIDDEN",
        error: result.error!,
      };
    }

    // 5. Cache revalidation
    revalidatePath("/dashboard/users");

    // 6. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "toggleUserBan",
      userId: caller.id,
      resourceId: userId,
      durationMs,
      message: "User ban toggled",
    });
    return { success: true, data: { id: userId, banned: result.banned! } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "toggleUserBan",
      durationMs,
      message: "Failed to toggle user ban",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[toggleUserBan]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to toggle user ban",
    };
  }
}

export async function banUser(
  userId: string
): Promise<ActionResult<{ id: string }>> {
  const trace = startTrace();
  try {
    // 1. Authentication
    const caller = await authenticate();
    if (!caller) {
      return {
        success: false,
        code: "UNAUTHORIZED",
        error: "You must be signed in",
      };
    }

    // 2. Authorization (owner only)
    if (caller.role !== ROLES.OWNER) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Only the owner can delete users",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`ban-user:${caller.id}`, "write-heavy");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Service call
    const result = await userService.ban(caller.id, caller.role, userId);
    if (!result.success) {
      return {
        success: false,
        code: result.error === "User not found" ? "NOT_FOUND" : "FORBIDDEN",
        error: result.error!,
      };
    }

    // 5. Cache revalidation
    revalidatePath("/dashboard/users");

    // 6. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "banUser",
      userId: caller.id,
      resourceId: userId,
      durationMs,
      message: "User banned",
    });
    return { success: true, data: { id: userId } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "banUser",
      durationMs,
      message: "Failed to ban user",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[banUser]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to ban user",
    };
  }
}
