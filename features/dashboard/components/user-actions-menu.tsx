"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeUserRole, toggleUserBan, banUser } from "@/actions/user-management";
import type { Role } from "@/types/roles";
import { UserMenuItems, RoleSelectMenu, ROLE_BADGE } from "./user-menu-items";

interface UserActionsMenuProps {
  userId: string;
  currentRole: Role;
  userName: string | null;
  isBanned: boolean;
  callerRole: Role;
}

export function UserActionsMenu({
  userId,
  currentRole,
  userName,
  isBanned,
  callerRole,
}: UserActionsMenuProps) {
  const isOwner = currentRole === "owner";
  const canDelete = callerRole === "owner";
  const canChangeRole = callerRole === "owner" || (callerRole === "admin" && !isOwner);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowRoleSelect(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setShowRoleSelect(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleChangeRole(role: Role) {
    const res = await changeUserRole(userId, role);
    if (!res.success) alert(res.error);
    setOpen(false);
    setShowRoleSelect(false);
    refresh();
  }

  async function handleToggleBan() {
    const action = isBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} ${userName || "this user"}?`)) return;
    const res = await toggleUserBan(userId);
    if (!res.success) alert(res.error);
    setOpen(false);
    refresh();
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete ${userName || "this user"}? This cannot be undone.`)) return;
    const res = await banUser(userId);
    if (!res.success) alert(res.error);
    setOpen(false);
    refresh();
  }

  return (
    <>
      {/* Trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => { setOpen((o) => !o); setShowRoleSelect(false); }}
        disabled={isPending}
        className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
        aria-label="User actions"
      >
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      </button>

      {/* Desktop dropdown */}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-50 mt-1 hidden w-52 overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated shadow-lg sm:block"
        >
          {showRoleSelect ? (
            <RoleSelectMenu
              callerRole={callerRole}
              currentRole={currentRole}
              isPending={isPending}
              onSelect={handleChangeRole}
              onBack={() => setShowRoleSelect(false)}
            />
          ) : (
            <UserMenuItems
              currentRole={currentRole}
              isBanned={isBanned}
              isPending={isPending}
              canChangeRole={canChangeRole}
              canDelete={canDelete}
              onOpenRoleSelect={() => setShowRoleSelect(true)}
              onToggleBan={handleToggleBan}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}

      {/* Mobile bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => { setOpen(false); setShowRoleSelect(false); }}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border-subtle bg-surface shadow-lg">
            <div className="flex justify-center pt-3 pb-2">
              <div className="size-8 rounded-full bg-border" />
            </div>

            <div className="pb-[env(safe-area-inset-bottom)]">
              {showRoleSelect ? (
                <div className="pb-[env(safe-area-inset-bottom)]">
                  <div className="px-4 pb-3">
                    <button
                      type="button"
                      onClick={() => setShowRoleSelect(false)}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      Back
                    </button>
                  </div>
                  <div className="border-t border-border-subtle">
                    {(() => {
                      const options = callerRole === "owner"
                        ? [{ value: "user" as const, label: "User" }, { value: "moderator" as const, label: "Moderator" }, { value: "admin" as const, label: "Admin" }]
                        : [{ value: "user" as const, label: "User" }, { value: "moderator" as const, label: "Moderator" }, { value: "admin" as const, label: "Admin" }].filter(() => true);
                      return options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleChangeRole(option.value)}
                          disabled={isPending}
                          className={`flex w-full items-center justify-between px-5 py-3.5 text-base transition-colors active:bg-surface-hover disabled:opacity-50 ${
                            currentRole === option.value
                              ? "font-medium text-accent"
                              : "text-foreground"
                          }`}
                        >
                          {option.label}
                          {currentRole === option.value && (
                            <svg className="size-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              ) : (
                <>
                  {canChangeRole && (
                    <button
                      type="button"
                      onClick={() => setShowRoleSelect(true)}
                      className="flex w-full items-center gap-3.5 px-5 py-3.5 text-base text-foreground transition-colors active:bg-surface-hover"
                    >
                      <svg className="size-5 text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                      Change role
                      <span className={`ml-auto rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[currentRole]}`}>
                        {currentRole}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleToggleBan}
                    disabled={isPending || isOwner}
                    className="flex w-full items-center gap-3.5 px-5 py-3.5 text-base text-foreground transition-colors active:bg-surface-hover disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isBanned ? (
                      <>
                        <svg className="size-5 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Unban user
                      </>
                    ) : (
                      <>
                        <svg className="size-5 text-warning" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        Ban user
                      </>
                    )}
                  </button>

                  {canDelete && (
                    <>
                      <div className="border-t border-border-subtle" />
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex w-full items-center gap-3.5 px-5 py-3.5 text-base text-error transition-colors active:bg-error-muted disabled:opacity-50"
                      >
                        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete user
                      </button>
                    </>
                  )}

                  <div className="border-t border-border-subtle" />
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setShowRoleSelect(false); }}
                    className="w-full py-3.5 text-center text-base font-medium text-muted-foreground transition-colors active:bg-surface-hover"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
