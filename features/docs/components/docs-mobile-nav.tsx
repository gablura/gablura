"use client";

import Link from "next/link";
import type { ResourceType } from "@/types/resources";
import { RESOURCE_TYPE_LABELS } from "@/types/resources";

interface DocSidebarItem {
  slug: string;
  title: string;
  type: ResourceType;
  version: string;
  hasMdx: boolean;
}

interface DocsMobileNavProps {
  title: string;
  slug: string;
  sections: { slug: string; title: string }[];
  sidebarItems: DocSidebarItem[];
  activeType: ResourceType;
  activeSection: string;
  onTypeChange: (type: ResourceType) => void;
  onSectionClick: (slug: string) => void;
}

const DOC_TYPES: ResourceType[] = ["package", "sdk", "tool", "project"];

export default function DocsMobileNav({
  title,
}: DocsMobileNavProps) {
  return (
    <>
      {/* Mobile nav bar */}
      <div className="sticky top-14 z-40 flex items-center justify-between border-b border-border-subtle bg-background px-container py-3 lg:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/docs"
            className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <span className="text-border">/</span>
          <span className="truncate text-sm font-medium text-foreground">
            {title}
          </span>
        </div>
        <MobileDrawerToggle />
      </div>
    </>
  );
}

function MobileDrawerToggle() {
  return (
    <button
      type="button"
      onClick={() => {
        const event = new CustomEvent("toggle-docs-mobile-nav");
        window.dispatchEvent(event);
      }}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
    >
      <svg
        className="size-3.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      Navigate
    </button>
  );
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  slug,
  sections,
  sidebarItems,
  activeType,
  activeSection,
  onTypeChange,
  onSectionClick,
}: DocsMobileNavProps & { isOpen: boolean; onClose: () => void }) {
  const filteredSidebar = sidebarItems.filter((item) => item.type === activeType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-border-subtle bg-background shadow-lg">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Navigation
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          {/* Type tabs */}
          <div className="mb-4 flex gap-1">
            {DOC_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onTypeChange(type)}
                className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider transition-colors ${
                  activeType === type
                    ? "bg-accent-muted text-accent"
                    : "text-text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {RESOURCE_TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Resource list */}
          <nav className="space-y-0.5">
            {filteredSidebar.map((item) => (
              <Link
                key={item.slug}
                href={`/docs/${item.slug}`}
                onClick={onClose}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  item.slug === slug
                    ? "bg-accent-muted text-accent"
                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <span className="truncate">{item.title}</span>
                <span className="ml-2 shrink-0 text-[10px] font-mono text-text-muted">
                  v{item.version}
                </span>
              </Link>
            ))}
          </nav>

          {/* Section nav */}
          {sections.length > 0 && (
            <div className="mt-6 border-t border-border-subtle pt-4">
              <p className="mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-text-muted">
                On this page
              </p>
              <nav className="space-y-0.5">
                {sections.map((section) => (
                  <button
                    key={section.slug}
                    type="button"
                    onClick={() => {
                      onSectionClick(section.slug);
                      onClose();
                    }}
                    className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      activeSection === section.slug
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
