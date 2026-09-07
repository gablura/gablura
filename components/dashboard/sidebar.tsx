"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineCube,
  HiOutlineWrenchScrewdriver,
  HiOutlineCommandLine,
} from "react-icons/hi2";
import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";
import { cn } from "@/lib/utils";
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
    roles: ["owner", "admin"],
  },
];

function NavItemButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-accent/10 text-accent"
          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
      )}
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors duration-150",
          isActive ? "text-accent" : "text-text-muted group-hover:text-muted-foreground"
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const filteredNav = NAV_ITEMS;

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3.5 z-40 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <LuPanelLeftOpen className="size-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-border-subtle bg-background px-4 pb-6 pt-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-3"
          >
            <span className="text-foreground text-base font-semibold tracking-tight">
              Gablura
            </span>
            <span className="inline-block size-1.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125" />
            <span className="text-xs font-medium text-text-muted">
              Dashboard
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1">
            {filteredNav.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <NavItemButton
                  key={item.href}
                  item={item}
                  isActive={isActive}
                />
              );
            })}
          </nav>

          {/* Footer */}
          <div className="flex flex-col gap-1 border-t border-border-subtle pt-4">
            <Link
              href="/dashboard/settings"
              className="group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
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
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <aside
          className={cn(
            "relative flex h-full w-64 flex-col border-r border-border-subtle bg-background transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <span className="text-foreground text-base font-semibold tracking-tight">
                Gablura
              </span>
              <span className="inline-block size-1.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125" />
              <span className="text-xs font-medium text-text-muted">
                Dashboard
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Close sidebar"
            >
              <LuPanelLeftClose className="size-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
            {filteredNav.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <NavItemButton
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  onClick={() => setMobileOpen(false)}
                />
              );
            })}
          </nav>

          {/* Footer */}
          <div className="flex flex-col gap-1 border-t border-border-subtle px-3 py-4">
            <Link
              href="/dashboard/settings"
              className="group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
              onClick={() => setMobileOpen(false)}
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
        </aside>
      </div>
    </>
  );
}
