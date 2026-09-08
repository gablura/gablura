import { UserActionsMenu } from "@/features/dashboard/components/user-actions-menu";
import type { Role } from "@/types/roles";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  bannedAt: Date | null;
  createdAt: Date;
}

const ROLE_BADGE: Record<Role, string> = {
  owner: "bg-accent/10 text-accent border-accent/20",
  admin: "bg-info-muted text-info border-info-border",
  moderator: "bg-warning-muted text-warning border-warning-border",
  user: "bg-surface-elevated text-muted-foreground border-border",
};

const ROLE_COUNTS = (users: User[]) => {
  const counts: Record<string, number> = {};
  for (const u of users) {
    const r = u.role || "user";
    counts[r] = (counts[r] || 0) + 1;
  }
  return counts;
};

export default function UsersPageClient({
  users,
  callerRole,
}: {
  users: User[];
  callerRole: Role;
}) {
  const counts = ROLE_COUNTS(users);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["owner", "admin", "moderator", "user"] as Role[]).map((role) => (
          <div
            key={role}
            className="rounded-xl border border-border-subtle bg-surface p-4"
          >
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              {role}
            </span>
            <p className="mt-1.5 text-2xl font-semibold text-foreground">
              {counts[role] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden rounded-xl border border-border-subtle bg-surface lg:block">
        <div className="grid grid-cols-[1fr_100px_100px_100px_48px] gap-4 border-b border-border-subtle bg-surface-elevated/50 px-5 py-3">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            User
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Role
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Status
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Joined
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted text-right">
            Actions
          </span>
        </div>

        <div className="divide-y divide-border-subtle">
          {users.map((user) => {
            const role = (user.role ?? "user") as Role;
            const initials = (user.name?.[0] ?? user.email[0]).toUpperCase();
            const isVerified = !!user.emailVerified;
            const isBanned = !!user.bannedAt;
            const joinedDate = new Date(user.createdAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );

            return (
              <div
                key={user.id}
                className="group grid grid-cols-[1fr_100px_100px_100px_48px] items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-elevated/50"
              >
                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-semibold text-muted-foreground ring-1 ring-border-subtle">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name || "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <span
                  className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[role]}`}
                >
                  {role}
                </span>

                {/* Status */}
                <div>
                  {isBanned ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-error">
                      <span className="size-1.5 rounded-full bg-error" />
                      Banned
                    </span>
                  ) : isVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                      <span className="size-1.5 rounded-full bg-success" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning">
                      <span className="size-1.5 rounded-full bg-warning" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Joined */}
                <span className="text-xs text-text-muted">{joinedDate}</span>

                {/* Actions */}
                <div className="relative flex justify-end">
                  <UserActionsMenu
                    userId={user.id}
                    currentRole={role}
                    userName={user.name}
                    isBanned={isBanned}
                    callerRole={callerRole}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {users.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">No users found.</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {users.map((user) => {
          const role = (user.role ?? "user") as Role;
          const initials = (user.name?.[0] ?? user.email[0]).toUpperCase();
          const isVerified = !!user.emailVerified;
          const isBanned = !!user.bannedAt;
          const joinedDate = new Date(user.createdAt).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" }
          );

          return (
            <div
              key={user.id}
              className="rounded-xl border border-border-subtle bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-muted-foreground ring-1 ring-border-subtle">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name || "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="relative shrink-0">
                  <UserActionsMenu
                    userId={user.id}
                    currentRole={role}
                    userName={user.name}
                    isBanned={isBanned}
                    callerRole={callerRole}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize ${ROLE_BADGE[role]}`}
                >
                  {role}
                </span>

                {isBanned ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-error">
                    <span className="size-1 rounded-full bg-error" />
                    Banned
                  </span>
                ) : isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                    <span className="size-1 rounded-full bg-success" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-warning">
                    <span className="size-1 rounded-full bg-warning" />
                    Pending
                  </span>
                )}

                <span className="text-[11px] text-text-muted ml-auto">
                  {joinedDate}
                </span>
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="rounded-xl border border-border-subtle bg-surface px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
