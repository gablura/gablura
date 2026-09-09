"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { SidebarLogo, SidebarNav, SidebarFooter } from "./sidebar-parts";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
          <SidebarLogo />
          <SidebarNav pathname={pathname} />
          <SidebarFooter />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={cn(
            "relative flex h-full w-64 flex-col border-r border-border-subtle bg-background transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
            <SidebarLogo onClick={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Close sidebar"
            >
              <LuPanelLeftClose className="size-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-1 px-3 py-4">
            <SidebarNav pathname={pathname} onNavClick={() => setMobileOpen(false)} />
          </div>

          <div className="flex flex-col gap-1 border-t border-border-subtle px-3 py-4">
            <SidebarFooter onNavClick={() => setMobileOpen(false)} />
          </div>
        </aside>
      </div>
    </>
  );
}
