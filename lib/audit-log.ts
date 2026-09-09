export type AuditAction =
  | "RESOURCE_CREATED"
  | "RESOURCE_UPDATED"
  | "RESOURCE_DELETED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_DELETED"
  | "ROLE_CHANGED"
  | "USER_BANNED"
  | "USER_UNBANNED";

export interface AuditEntry {
  actor: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLog: AuditEntry[] = [];

export function logAudit(entry: Omit<AuditEntry, "createdAt">) {
  auditLog.push({ ...entry, createdAt: new Date() });
}

export function getAuditLog(filter?: { action?: AuditAction; resource?: string }) {
  if (!filter) return auditLog;
  return auditLog.filter((e) => {
    if (filter.action && e.action !== filter.action) return false;
    if (filter.resource && e.resource !== filter.resource) return false;
    return true;
  });
}
