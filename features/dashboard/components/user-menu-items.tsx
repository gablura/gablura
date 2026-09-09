"use client";

import { ROLES, ROLE_HIERARCHY } from "@/types/roles";
import type { Role } from "@/types/roles";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: ROLES.USER, label: "User" },
  { value: ROLES.MODERATOR, label: "Moderator" },
  { value: ROLES.ADMIN, label: "Admin" },
];

export const ROLE_BADGE: Record<Role, string> = {
  owner: "bg-accent/10 text-accent border-accent/20",
  admin: "bg-info-muted text-info border-info-border",
  moderator: "bg-warning-muted text-warning border-warning-border",
  user: "bg-surface-elevated text-muted-foreground border-border",
};

export function getAvailableRoles(callerRole: Role) {
  return ROLE_OPTIONS.filter((o) => {
    if (callerRole === "owner") return true;
    return ROLE_HIERARCHY[o.value] < ROLE_HIERARCHY[callerRole];
  });
}

interface RoleSelectMenuProps {
  callerRole: Role;
  currentRole: Role;
  isPending: boolean;
  onSelect: (role: Role) => void;
  onBack: () => void;
}

export function RoleSelectMenu({
  callerRole,
  currentRole,
  isPending,
  onSelect,
  onBack,
}: RoleSelectMenuProps) {
  const options = getAvailableRoles(callerRole);

  return (
    <div className="p-1">
      <button
        type="button"
        onClick={onBack}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>
      <div className="my-1 border-t border-border-subtle" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          disabled={isPending}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-hover disabled:opacity-50 ${
            currentRole === option.value
              ? "font-medium text-accent"
              : "text-foreground"
          }`}
        >
          {option.label}
          {currentRole === option.value && (
            <svg className="size-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

interface UserMenuItemsProps {
  currentRole: Role;
  isBanned: boolean;
  isPending: boolean;
  canChangeRole: boolean;
  canDelete: boolean;
  onOpenRoleSelect: () => void;
  onToggleBan: () => void;
  onDelete: () => void;
  size?: "sm" | "md";
}

export function UserMenuItems({
  currentRole,
  isBanned,
  isPending,
  canChangeRole,
  canDelete,
  onOpenRoleSelect,
  onToggleBan,
  onDelete,
  size = "sm",
}: UserMenuItemsProps) {
  const iconSize = size === "sm" ? "size-4" : "size-5";

  return (
    <div className="p-1">
      {canChangeRole && (
        <button
          type="button"
          onClick={onOpenRoleSelect}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
        >
          <svg className={`${iconSize} text-text-muted`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          Change role
          <span className={`ml-auto rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize ${ROLE_BADGE[currentRole]}`}>
            {currentRole}
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={onToggleBan}
        disabled={isPending || currentRole === "owner"}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-50"
      >
        {isBanned ? (
          <>
            <svg className={`${iconSize} text-success`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Unban user
          </>
        ) : (
          <>
            <svg className={`${iconSize} text-warning`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            Ban user
          </>
        )}
      </button>

      {canDelete && (
        <>
          <div className="my-1 border-t border-border-subtle" />
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error transition-colors hover:bg-error-muted disabled:opacity-50"
          >
            <svg className={iconSize} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete user
          </button>
        </>
      )}
    </div>
  );
}
