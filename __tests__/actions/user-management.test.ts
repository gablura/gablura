import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-helpers", () => ({
  authenticate: vi.fn(),
}));

vi.mock("@/lib/permissions", () => ({
  hasPermission: vi.fn(() => true),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true })),
}));

vi.mock("@/lib/trace", () => ({
  startTrace: vi.fn(() => ({ requestId: "test-req", startTime: Date.now() })),
  endTrace: vi.fn(() => ({ requestId: "test-req", durationMs: 10 })),
  structuredLog: vi.fn(),
}));

vi.mock("@/features/users/services/user-service", () => ({
  changeRole: vi.fn(),
  toggleBan: vi.fn(),
  ban: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { changeUserRole, toggleUserBan, banUser } from "@/actions/user-management";
import { authenticate } from "@/lib/auth-helpers";
import { hasPermission } from "@/lib/permissions";
import * as userService from "@/features/users/services/user-service";

const mockAuthenticate = vi.mocked(authenticate);
const mockHasPermission = vi.mocked(hasPermission);
const mockUserService = vi.mocked(userService);

function resetMocks() {
  mockAuthenticate.mockReset();
  mockHasPermission.mockReset();
  mockUserService.changeRole.mockReset();
  mockUserService.toggleBan.mockReset();
  mockUserService.ban.mockReset();

  mockHasPermission.mockReturnValue(true);
}

describe("changeUserRole", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await changeUserRole("user-2", "admin");

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

    const result = await changeUserRole("user-2", "admin");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });

  it("returns VALIDATION_ERROR for invalid role", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });

    const result = await changeUserRole("user-2", "superadmin");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("VALIDATION_ERROR");
    }
  });

  it("returns NOT_FOUND when user does not exist", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockUserService.changeRole.mockResolvedValue({
      success: false,
      error: "User not found",
    });

    const result = await changeUserRole("nonexistent", "admin");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("returns success on valid role change", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "owner",
    });
    mockUserService.changeRole.mockResolvedValue({ success: true });

    const result = await changeUserRole("user-2", "admin");

    expect(result.success).toBe(true);
  });
});

describe("toggleUserBan", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await toggleUserBan("user-2");

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

    const result = await toggleUserBan("user-2");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });

  it("returns NOT_FOUND when user does not exist", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockUserService.toggleBan.mockResolvedValue({
      success: false,
      error: "User not found",
    });

    const result = await toggleUserBan("nonexistent");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("returns success on valid toggle", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });
    mockUserService.toggleBan.mockResolvedValue({
      success: true,
      banned: true,
    });

    const result = await toggleUserBan("user-2");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.banned).toBe(true);
    }
  });
});

describe("banUser", () => {
  beforeEach(resetMocks);

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockAuthenticate.mockResolvedValue(null);

    const result = await banUser("user-2");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns FORBIDDEN for non-owner", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "admin",
    });

    const result = await banUser("user-2");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("FORBIDDEN");
    }
  });

  it("returns NOT_FOUND when user does not exist", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "owner",
    });
    mockUserService.ban.mockResolvedValue({
      success: false,
      error: "User not found",
    });

    const result = await banUser("nonexistent");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("returns success on valid ban", async () => {
    mockAuthenticate.mockResolvedValue({
      id: "user-1",
      name: "Test User",
      role: "owner",
    });
    mockUserService.ban.mockResolvedValue({ success: true });

    const result = await banUser("user-2");

    expect(result.success).toBe(true);
  });
});
