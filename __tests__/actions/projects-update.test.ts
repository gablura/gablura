import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-helpers", () => ({
  authenticate: vi.fn(),
  canModify: vi.fn(() => true),
}));

vi.mock("@/lib/permissions", () => ({
  hasPermission: vi.fn(() => true),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true })),
}));

vi.mock("@/lib/idempotency", () => ({
  checkIdempotency: vi.fn(() => ({ isDuplicate: false })),
  recordIdempotency: vi.fn(),
}));

vi.mock("@/lib/trace", () => ({
  startTrace: vi.fn(() => ({ requestId: "test-req", startTime: Date.now() })),
  endTrace: vi.fn(() => ({ requestId: "test-req", durationMs: 10 })),
  structuredLog: vi.fn(),
}));

vi.mock("@/features/projects/services/project-service", () => ({
  listByRole: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  getRawById: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { updateProject } from "@/actions/projects";
import { authenticate, canModify } from "@/lib/auth-helpers";
import { hasPermission } from "@/lib/permissions";
import * as projectService from "@/features/projects/services/project-service";

const mockAuthenticate = vi.mocked(authenticate);
const mockCanModify = vi.mocked(canModify);
const mockHasPermission = vi.mocked(hasPermission);
const mockProjectService = vi.mocked(projectService);

function resetMocks() {
  mockAuthenticate.mockReset();
  mockHasPermission.mockReset();
  mockCanModify.mockReset();
  mockProjectService.getRawById.mockReset();
  mockProjectService.update.mockReset();

  mockHasPermission.mockReturnValue(true);
  mockCanModify.mockReturnValue(true);
}

const VALID_FORM = {
  name: "Test",
  slug: "",
  tagline: "",
  description: "Desc",
  techStack: "",
  frontendUrl: "",
  backendUrl: "",
  repositoryUrl: "",
  imageUrl: "",
  status: "in-development" as const,
  featured: false,
};

describe("updateProject", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await updateProject("some-id", VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns FORBIDDEN when user lacks permission", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "user",
    });
    mockHasPermission.mockReturnValue(false);

    const result = await updateProject("some-id", VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });

  it("returns NOT_FOUND when project does not exist", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockProjectService.getRawById.mockResolvedValue(null);

    const result = await updateProject("nonexistent-id", VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("returns FORBIDDEN when user does not own project", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockCanModify.mockReturnValue(false);
    mockProjectService.getRawById.mockResolvedValue({
      _id: { toString: () => "some-id" },
      authorId: "other-user",
    } as any);

    const result = await updateProject("some-id", VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });

  it("returns success on valid update", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockProjectService.getRawById.mockResolvedValue({
      _id: { toString: () => "some-id" },
      authorId: "user-1",
    } as any);
    mockProjectService.update.mockResolvedValue(undefined);

    const result = await updateProject("some-id", VALID_FORM);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("some-id");
    }
  });
});
