import { randomBytes } from "crypto";

export interface TraceContext {
  requestId: string;
  startTime: number;
}

export function startTrace(): TraceContext {
  return {
    requestId: randomBytes(16).toString("hex"),
    startTime: Date.now(),
  };
}

export function endTrace(ctx: TraceContext): { requestId: string; durationMs: number } {
  return {
    requestId: ctx.requestId,
    durationMs: Date.now() - ctx.startTime,
  };
}

export interface StructuredLog {
  level: "info" | "warn" | "error";
  requestId: string;
  action: string;
  userId?: string;
  resourceId?: string;
  durationMs?: number;
  message: string;
  metadata?: Record<string, unknown>;
}

const logBuffer: StructuredLog[] = [];
const MAX_BUFFER = 1000;

export function structuredLog(entry: Omit<StructuredLog, "requestId"> & { requestId: string }) {
  logBuffer.push(entry);
  if (logBuffer.length > MAX_BUFFER) {
    logBuffer.splice(0, logBuffer.length - MAX_BUFFER);
  }

  if (entry.level === "error") {
    console.error(
      JSON.stringify({
        ...entry,
        timestamp: new Date().toISOString(),
      })
    );
  }
}

export function getStructuredLogs(filter?: { action?: string; userId?: string }) {
  if (!filter) return logBuffer;
  return logBuffer.filter((e) => {
    if (filter.action && e.action !== filter.action) return false;
    if (filter.userId && e.userId !== filter.userId) return false;
    return true;
  });
}
