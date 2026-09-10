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

interface DocsSidebarNavProps {
  slug: string;
  sections: { slug: string; title: string }[];
  sidebarItems: DocSidebarItem[];
  activeType: ResourceType;
  activeSection: string;
  onTypeChange: (type: ResourceType) => void;
  onSectionClick: (slug: string) => void;
}

const DOC_TYPES: ResourceType[] = ["package", "sdk", "tool", "project"];

export default function DocsSidebarNav({
  slug,
  sections,
  sidebarItems,
  activeType,
  activeSection,
  onTypeChange,
  onSectionClick,
}: DocsSidebarNavProps) {
  const filteredSidebar = sidebarItems.filter((item) => item.type === activeType);

  return (
    <div className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border-subtle p-4 lg:block">
      <div className="mb-4">
        <Link
          href="/docs"
          className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-foreground"
        >
          ← All docs
        </Link>
      </div>

      {/* Type tabs */}
      <div className="mb-4 flex flex-wrap gap-1">
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
                onClick={() => onSectionClick(section.slug)}
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
  );
}
