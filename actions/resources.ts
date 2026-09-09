"use server";

import { revalidatePath } from "next/cache";
import { authenticate, canModify } from "@/lib/auth-helpers";
import { hasPermission } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkIdempotency, recordIdempotency } from "@/lib/idempotency";
import { startTrace, endTrace, structuredLog } from "@/lib/trace";
import { createResourceSchema, updateResourceSchema } from "@/features/resources/schemas/resource-schema";
import * as resourceService from "@/features/resources/services/resource-service";
import type { ResourceType, ResourceFormData } from "@/types/resources";
import type { ResourceListItem } from "@/features/resources/dtos/resource-dto";
import type { ActionResult } from "@/types/action-result";

export async function getResources(
  type: ResourceType
): Promise<ActionResult<ResourceListItem[]>> {
  const trace = startTrace();
  try {
    const caller = await authenticate();
    if (!caller) {
      return {
        success: false,
        code: "UNAUTHORIZED",
        error: "You must be signed in",
      };
    }

    const resources = await resourceService.listByRole(type, caller);
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "getResources",
      userId: caller.id,
      durationMs,
      message: "Resources fetched",
    });
    return { success: true, data: resources };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "getResources",
      durationMs,
      message: "Failed to fetch resources",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[getResources]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to fetch resources",
    };
  }
}

export async function createResource(
  type: ResourceType,
  formData: ResourceFormData
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
    if (!hasPermission(caller.role, "resources.write")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`resource:create:${caller.id}`, "write");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Input validation
    const validated = createResourceSchema.safeParse(formData);
    if (!validated.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validated.error.issues) {
        const field = issue.path[0] as string;
        if (field) {
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(issue.message);
        }
      }
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Please fix the errors below",
        fieldErrors,
      };
    }

    // 5. Idempotency check
    const { isDuplicate, existingResourceId } = await checkIdempotency(
      caller.id,
      `create:${type}`,
      validated.data as unknown as Record<string, unknown>
    );
    if (isDuplicate && existingResourceId) {
      return { success: true, data: { id: existingResourceId } };
    }

    // 6. Service call
    const id = await resourceService.create(type, validated.data, caller);

    // 7. Record idempotency
    await recordIdempotency(
      caller.id,
      `create:${type}`,
      validated.data as unknown as Record<string, unknown>,
      id
    );

    // 8. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/${type}s`);

    // 9. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "createResource",
      userId: caller.id,
      resourceId: id,
      durationMs,
      message: "Resource created",
    });
    return { success: true, data: { id } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "createResource",
      durationMs,
      message: "Failed to create resource",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[createResource]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to create resource",
    };
  }
}

export async function updateResource(
  type: ResourceType,
  resourceId: string,
  formData: ResourceFormData
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
    if (!hasPermission(caller.role, "resources.write")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`resource:update:${caller.id}`, "write");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Input validation
    const validated = updateResourceSchema.safeParse(formData);
    if (!validated.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validated.error.issues) {
        const field = issue.path[0] as string;
        if (field) {
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(issue.message);
        }
      }
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Please fix the errors below",
        fieldErrors,
      };
    }

    // 5. Ownership check
    const existing = await resourceService.getRawById(type, resourceId);
    if (!existing) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Resource not found",
      };
    }

    if (!canModify(caller.role, caller.id, existing.authorId)) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "You can only edit your own resources",
      };
    }

    // 6. Service call
    await resourceService.update(type, resourceId, validated.data, caller);

    // 7. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/${type}s`);

    // 8. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "updateResource",
      userId: caller.id,
      resourceId,
      durationMs,
      message: "Resource updated",
    });
    return { success: true, data: { id: resourceId } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "updateResource",
      durationMs,
      message: "Failed to update resource",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[updateResource]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to update resource",
    };
  }
}

export async function deleteResource(
  type: ResourceType,
  resourceId: string
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
    if (!hasPermission(caller.role, "resources.delete")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`resource:delete:${caller.id}`, "write");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Ownership check
    const existing = await resourceService.getRawById(type, resourceId);
    if (!existing) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Resource not found",
      };
    }

    if (!canModify(caller.role, caller.id, existing.authorId)) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "You can only delete your own resources",
      };
    }

    // 5. Service call
    await resourceService.remove(type, resourceId, caller);

    // 6. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/${type}s`);

    // 7. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "deleteResource",
      userId: caller.id,
      resourceId,
      durationMs,
      message: "Resource deleted",
    });
    return { success: true, data: { id: resourceId } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "deleteResource",
      durationMs,
      message: "Failed to delete resource",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[deleteResource]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to delete resource",
    };
  }
}
