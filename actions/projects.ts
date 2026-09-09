"use server";

import { revalidatePath } from "next/cache";
import { authenticate, canModify } from "@/lib/auth-helpers";
import { hasPermission } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkIdempotency, recordIdempotency } from "@/lib/idempotency";
import { startTrace, endTrace, structuredLog } from "@/lib/trace";
import { createProjectSchema, updateProjectSchema } from "@/features/projects/schemas/project-schema";
import * as projectService from "@/features/projects/services/project-service";
import type { ProjectFormData } from "@/types/projects";
import type { ProjectListItem } from "@/features/projects/dtos/project-dto";
import type { ActionResult } from "@/types/action-result";

export async function getProjects(): Promise<ActionResult<ProjectListItem[]>> {
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

    const projects = await projectService.listByRole(caller);
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "getProjects",
      userId: caller.id,
      durationMs,
      message: "Projects fetched",
    });
    return { success: true, data: projects };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "getProjects",
      durationMs,
      message: "Failed to fetch projects",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[getProjects]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to fetch projects",
    };
  }
}

export async function createProject(
  formData: ProjectFormData
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
    if (!hasPermission(caller.role, "projects.write")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`project:create:${caller.id}`, "write");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Input validation
    const validated = createProjectSchema.safeParse(formData);
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
      "create:project",
      validated.data as unknown as Record<string, unknown>
    );
    if (isDuplicate && existingResourceId) {
      return { success: true, data: { id: existingResourceId } };
    }

    // 6. Service call
    const id = await projectService.create(validated.data, caller);

    // 7. Record idempotency
    await recordIdempotency(
      caller.id,
      "create:project",
      validated.data as unknown as Record<string, unknown>,
      id
    );

    // 8. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath("/projects");

    // 9. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "createProject",
      userId: caller.id,
      resourceId: id,
      durationMs,
      message: "Project created",
    });
    return { success: true, data: { id } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "createProject",
      durationMs,
      message: "Failed to create project",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[createProject]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to create project",
    };
  }
}

export async function updateProject(
  projectId: string,
  formData: ProjectFormData
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
    if (!hasPermission(caller.role, "projects.write")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`project:update:${caller.id}`, "write");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Input validation
    const validated = updateProjectSchema.safeParse(formData);
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
    const existing = await projectService.getRawById(projectId);
    if (!existing) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Project not found",
      };
    }

    if (!canModify(caller.role, caller.id, existing.authorId)) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "You can only edit your own projects",
      };
    }

    // 6. Service call
    await projectService.update(projectId, validated.data, caller);

    // 7. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath("/projects");

    // 8. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "updateProject",
      userId: caller.id,
      resourceId: projectId,
      durationMs,
      message: "Project updated",
    });
    return { success: true, data: { id: projectId } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "updateProject",
      durationMs,
      message: "Failed to update project",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[updateProject]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to update project",
    };
  }
}

export async function deleteProject(
  projectId: string
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
    if (!hasPermission(caller.role, "projects.write")) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "Insufficient permissions",
      };
    }

    // 3. Rate limiting
    const { allowed } = checkRateLimit(`project:delete:${caller.id}`, "write");
    if (!allowed) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error: "Too many requests. Please try again later.",
      };
    }

    // 4. Ownership check
    const existing = await projectService.getRawById(projectId);
    if (!existing) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Project not found",
      };
    }

    if (!canModify(caller.role, caller.id, existing.authorId)) {
      return {
        success: false,
        code: "FORBIDDEN",
        error: "You can only delete your own projects",
      };
    }

    // 5. Service call
    await projectService.remove(projectId, caller);

    // 6. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath("/projects");

    // 7. Return result
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "info",
      requestId: trace.requestId,
      action: "deleteProject",
      userId: caller.id,
      resourceId: projectId,
      durationMs,
      message: "Project deleted",
    });
    return { success: true, data: { id: projectId } };
  } catch (error) {
    const { durationMs } = endTrace(trace);
    structuredLog({
      level: "error",
      requestId: trace.requestId,
      action: "deleteProject",
      durationMs,
      message: "Failed to delete project",
      metadata: { error: error instanceof Error ? error.message : "Unknown" },
    });
    console.error("[deleteProject]", error);
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Failed to delete project",
    };
  }
}
