"use client";

import Link from "next/link";
import type { Resource, ResourceType } from "@/types/resources";
import { RESOURCE_TYPE_LABELS } from "@/types/resources";

interface DocsSidebarProps {
  types: ResourceType[];
  resourcesByType: Record<ResourceType, Resource[]>;
  activeType: ResourceType;
  activeSlug?: string;
  onNavigate?: () => void;
}

const TYPE_ICONS: Record<ResourceType, string> = {
  package: "PK",
  tool: "TL",
  sdk: "SDK",
  project: "PR",
};

export default function DocsSidebar({
  types,
  resourcesByType,
  activeType,
  activeSlug,
  onNavigate,
}: DocsSidebarProps) {
  const resources = resourcesByType[activeType] ?? [];

  return (
    <aside className="flex h-full flex-col">
      {/* Type tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface p-1">
        {types.map((type) => (
          <Link
            key={type}
            href={`/docs/${type}`}
            onClick={onNavigate}
            className={`relative flex-1 rounded-md px-3 py-1.5 text-center text-xs font-medium transition-colors duration-150 ${
              activeType === type
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {RESOURCE_TYPE_LABELS[type]}
          </Link>
        ))}
      </div>

      {/* Resource list */}
      <nav className="mt-6 flex-1 overflow-y-auto" aria-label="Documentation">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          {RESOURCE_TYPE_LABELS[activeType]}
        </p>

        <ul className="mt-3 space-y-0.5">
          {resources.map((resource) => {
            const href = `/docs/${activeType}/${resource.slug}`;
            const isActive = activeSlug === resource.slug;

            return (
              <li key={resource.id}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-accent-muted text-foreground"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] font-bold ${
                      isActive
                        ? "border-accent/20 bg-accent/10 text-accent"
                        : "border-border-subtle bg-background text-text-muted group-hover:border-border group-hover:text-muted-foreground"
                    }`}
                  >
                    {TYPE_ICONS[activeType]}
                  </span>
                  <span className="min-w-0 truncate font-medium">
                    {resource.name}
                  </span>
                </Link>
              </li>
            );
          })}

          {resources.length === 0 && (
            <li className="px-3 py-4 text-center text-sm text-text-muted">
              No {RESOURCE_TYPE_LABELS[activeType].toLowerCase()} yet.
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
