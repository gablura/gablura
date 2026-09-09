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

vi.mock("@/features/resources/services/resource-service", () => ({
  listByRole: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  getRawById: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getResources, createResource, deleteResource } from "@/actions/resources";
import { authenticate } from "@/lib/auth-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import * as resourceService from "@/features/resources/services/resource-service";

const mockAuthenticate = vi.mocked(authenticate);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockResourceService = vi.mocked(resourceService);

function resetMocks() {
  mockAuthenticate.mockReset();
  mockCheckRateLimit.mockReset();
  mockResourceService.getRawById.mockReset();
  mockResourceService.listByRole.mockReset();
  mockResourceService.create.mockReset();
  mockResourceService.update.mockReset();
  mockResourceService.remove.mockReset();

  mockCheckRateLimit.mockReturnValue({ allowed: true });
}

const VALID_FORM = {
  name: "Test",
  slug: "",
  description: "Desc",
  version: "",
  repositoryUrl: "",
  documentation: {
    overview: "",
    whyItExists: "",
    features: "",
    installation: "",
    quickStart: "",
    apiReference: "",
    examples: "",
    changelog: "",
  },
  status: "draft" as const,
  featured: false,
};

describe("getResources", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await getResources("package");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns resources on success", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockResourceService.listByRole.mockResolvedValue([]);

    const result = await getResources("package");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual([]);
    }
  });
});

describe("createResource", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await createResource("package", VALID_FORM);

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

    const result = await createResource("package", VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });

  it("returns RATE_LIMITED when rate limit exceeded", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockCheckRateLimit.mockReturnValue({ allowed: false, retryAfterMs: 60000 });

    const result = await createResource("package", VALID_FORM);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("RATE_LIMITED");
    }
  });

  it("returns VALIDATION_ERROR for invalid input", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });

    const result = await createResource("package", {
      ...VALID_FORM,
      name: "",
      description: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("VALIDATION_ERROR");
      expect(result.fieldErrors).toBeDefined();
    }
  });
});

describe("deleteResource", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await deleteResource("package", "some-id");

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

    const result = await deleteResource("package", "some-id");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });

  it("returns NOT_FOUND when resource does not exist", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockResourceService.getRawById.mockResolvedValue(null);

    const result = await deleteResource("package", "nonexistent-id");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("returns FORBIDDEN when user does not own resource", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockResourceService.getRawById.mockResolvedValue({
      _id: { toString: () => "some-id" },
      authorId: "other-user",
    } as any);

    const result = await deleteResource("package", "some-id");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });
});
