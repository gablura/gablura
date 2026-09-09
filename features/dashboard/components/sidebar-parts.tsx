"use client";

import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineCube,
  HiOutlineWrenchScrewdriver,
  HiOutlineCommandLine,
  HiOutlineBuildingLibrary,
} from "react-icons/hi2";
import type { Role } from "@/types/roles";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: HiOutlineHome,
    roles: ["owner", "admin", "moderator", "user"],
  },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: HiOutlineBuildingLibrary,
    roles: ["owner", "admin"],
  },
  {
    href: "/dashboard/packages",
    label: "Packages",
    icon: HiOutlineCube,
    roles: ["owner", "admin"],
  },
  {
    href: "/dashboard/tools",
    label: "Tools",
    icon: HiOutlineWrenchScrewdriver,
    roles: ["owner", "admin"],
  },
  {
    href: "/dashboard/sdks",
    label: "SDKs",
    icon: HiOutlineCommandLine,
    roles: ["owner", "admin"],
  },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: HiOutlineUsers,
    roles: ["owner"],
  },
];

export function SidebarLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/dashboard"
      className="group flex items-center gap-2 px-3"
      onClick={onClick}
    >
      <span className="text-foreground text-base font-semibold tracking-tight">
        Gablura
      </span>
      <span className="inline-block size-1.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125" />
      <span className="text-xs font-medium text-text-muted">
        Dashboard
      </span>
    </Link>
  );
}

export function SidebarNav({
  pathname,
  onNavClick,
}: {
  pathname: string;
  onNavClick?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={`group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
            )}
            <item.icon
              className={`size-[18px] shrink-0 transition-colors duration-150 ${
                isActive ? "text-accent" : "text-text-muted group-hover:text-muted-foreground"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarFooter({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border-subtle pt-4">
      <Link
        href="/dashboard/settings"
        className="group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
        onClick={onNavClick}
      >
        <HiOutlineCog6Tooth className="size-[18px] shrink-0 text-text-muted transition-colors duration-150 group-hover:text-muted-foreground" />
        <span>Settings</span>
      </Link>

      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
        >
          <svg
            className="size-[18px] shrink-0 text-text-muted"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span>Sign out</span>
        </button>
      </form>
    </div>
  );
}
