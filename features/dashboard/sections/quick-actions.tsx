import Link from "next/link";
import {
  HiOutlineUsers,
  HiOutlineArrowRight,
  HiOutlineCube,
  HiOutlineWrenchScrewdriver,
  HiOutlineCommandLine,
} from "react-icons/hi2";
import { canManageUsers } from "@/types/roles";
import type { Role } from "@/types/roles";

interface QuickActionsProps {
  userRole: Role;
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
        Quick actions
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {canManageUsers(userRole) && (
          <>
            <Link
              href="/dashboard/packages"
              className="group flex items-center justify-between rounded-xl border border-border-subtle bg-surface p-4 transition-all duration-150 hover:border-accent/25 hover:bg-surface-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10">
                  <HiOutlineCube className="size-[18px] text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Packages
                  </p>
                  <p className="text-xs text-text-muted">
                    Manage packages
                  </p>
                </div>
              </div>
              <HiOutlineArrowRight className="size-4 text-text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>

            <Link
              href="/dashboard/tools"
              className="group flex items-center justify-between rounded-xl border border-border-subtle bg-surface p-4 transition-all duration-150 hover:border-accent/25 hover:bg-surface-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10">
                  <HiOutlineWrenchScrewdriver className="size-[18px] text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Tools
                  </p>
                  <p className="text-xs text-text-muted">
                    Manage tools
                  </p>
                </div>
              </div>
              <HiOutlineArrowRight className="size-4 text-text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>

            <Link
              href="/dashboard/sdks"
              className="group flex items-center justify-between rounded-xl border border-border-subtle bg-surface p-4 transition-all duration-150 hover:border-accent/25 hover:bg-surface-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10">
                  <HiOutlineCommandLine className="size-[18px] text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    SDKs
                  </p>
                  <p className="text-xs text-text-muted">
                    Manage SDKs
                  </p>
                </div>
              </div>
              <HiOutlineArrowRight className="size-4 text-text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>

            <Link
              href="/dashboard/users"
              className="group flex items-center justify-between rounded-xl border border-border-subtle bg-surface p-4 transition-all duration-150 hover:border-accent/25 hover:bg-surface-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10">
                  <HiOutlineUsers className="size-[18px] text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Users
                  </p>
                  <p className="text-xs text-text-muted">
                    Manage user roles
                  </p>
                </div>
              </div>
              <HiOutlineArrowRight className="size-4 text-text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          </>
        )}

        <Link
          href="/dashboard/settings"
          className="group flex items-center justify-between rounded-xl border border-border-subtle bg-surface p-4 transition-all duration-150 hover:border-accent/25 hover:bg-surface-elevated"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-surface-elevated">
              <svg
                className="size-[18px] text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Settings</p>
              <p className="text-xs text-text-muted">
                Manage your preferences
              </p>
            </div>
          </div>
          <HiOutlineArrowRight className="size-4 text-text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" />
        </Link>
      </div>
    </div>
  );
}
