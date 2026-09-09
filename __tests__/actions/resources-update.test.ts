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

import { updateResource } from "@/actions/resources";
import { authenticate, canModify } from "@/lib/auth-helpers";
import { hasPermission } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";
import * as resourceService from "@/features/resources/services/resource-service";

const mockAuthenticate = vi.mocked(authenticate);
const mockCanModify = vi.mocked(canModify);
const mockHasPermission = vi.mocked(hasPermission);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockResourceService = vi.mocked(resourceService);

function resetMocks() {
  mockAuthenticate.mockReset();
  mockHasPermission.mockReset();
  mockCanModify.mockReset();
  mockCheckRateLimit.mockReset();
  mockResourceService.getRawById.mockReset();
  mockResourceService.update.mockReset();

  mockHasPermission.mockReturnValue(true);
  mockCanModify.mockReturnValue(true);
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

describe("updateResource", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await updateResource("package", "some-id", VALID_FORM);

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

    const result = await updateResource("package", "some-id", VALID_FORM);

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

    const result = await updateResource("package", "some-id", VALID_FORM);

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

    const result = await updateResource("package", "some-id", {
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

  it("returns NOT_FOUND when resource does not exist", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockResourceService.getRawById.mockResolvedValue(null);

    const result = await updateResource("package", "nonexistent-id", VALID_FORM);

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
    mockCanModify.mockReturnValue(false);
    mockResourceService.getRawById.mockResolvedValue({
      _id: { toString: () => "some-id" },
      authorId: "other-user",
    } as any);

    const result = await updateResource("package", "some-id", VALID_FORM);

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
    mockResourceService.getRawById.mockResolvedValue({
      _id: { toString: () => "some-id" },
      authorId: "user-1",
    } as any);
    mockResourceService.update.mockResolvedValue(undefined);

    const result = await updateResource("package", "some-id", VALID_FORM);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("some-id");
    }
  });
});
