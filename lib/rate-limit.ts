interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(cleanup, 60_000);
  if (cleanupInterval.unref) cleanupInterval.unref();
}

export interface RateLimitConfig {
  max: number;
  windowMs: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  write: { max: 30, windowMs: 60_000 },
  "write-heavy": { max: 10, windowMs: 60_000 },
  auth: { max: 5, windowMs: 900_000 },
  contact: { max: 5, windowMs: 3_600_000 },
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig | keyof typeof DEFAULTS = "write"
): { allowed: boolean; retryAfterMs?: number } {
  ensureCleanup();

  const resolved = typeof config === "string" ? DEFAULTS[config] : config;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + resolved.windowMs });
    return { allowed: true };
  }

  if (entry.count >= resolved.max) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true };
}
