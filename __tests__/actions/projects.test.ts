import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-helpers", () => ({
  authenticate: vi.fn(),
  canModify: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true })),
}));

vi.mock("@/lib/idempotency", () => ({
  checkIdempotency: vi.fn(() => ({ isDuplicate: false })),
  recordIdempotency: vi.fn(),
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

import { getProjects, createProject, deleteProject } from "@/actions/projects";
import { authenticate } from "@/lib/auth-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import * as projectService from "@/features/projects/services/project-service";

const mockAuthenticate = vi.mocked(authenticate);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockProjectService = vi.mocked(projectService);

function resetMocks() {
  mockAuthenticate.mockReset();
  mockCheckRateLimit.mockReset();
  mockProjectService.getRawById.mockReset();
  mockProjectService.listByRole.mockReset();
  mockProjectService.create.mockReset();
  mockProjectService.update.mockReset();
  mockProjectService.remove.mockReset();

  mockCheckRateLimit.mockReturnValue({ allowed: true });
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

describe("getProjects", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await getProjects();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns projects on success", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockProjectService.listByRole.mockResolvedValue([]);

    const result = await getProjects();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual([]);
    }
  });
});

describe("createProject", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await createProject(VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns FORBIDDEN for non-admin users", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "user",
    });

    const result = await createProject(VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });
});

describe("deleteProject", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await deleteProject("some-id");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns NOT_FOUND when project does not exist", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockProjectService.getRawById.mockResolvedValue(null);

    const result = await deleteProject("nonexistent-id");

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
    mockProjectService.getRawById.mockResolvedValue({
      _id: { toString: () => "some-id" },
      authorId: "other-user",
    } as any);

    const result = await deleteProject("some-id");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });
});
