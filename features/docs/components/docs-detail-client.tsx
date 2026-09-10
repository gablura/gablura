"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { ResourceType } from "@/types/resources";
import DocsMobileNav, { MobileNavDrawer } from "./docs-mobile-nav";
import DocsSidebarNav from "./docs-sidebar-nav";

interface DocSidebarItem {
  slug: string;
  title: string;
  type: ResourceType;
  version: string;
  hasMdx: boolean;
}

interface DocsDetailClientProps {
  slug: string;
  title: string;
  description: string;
  sections: { slug: string; title: string }[];
  sidebarItems?: DocSidebarItem[];
  children: React.ReactNode;
}

export default function DocsDetailClient({
  slug,
  title,
  description,
  sections,
  sidebarItems = [],
  children,
}: DocsDetailClientProps) {
  const [activeType, setActiveType] = useState<ResourceType>("package");
  const [activeSection, setActiveSection] = useState(sections[0]?.slug ?? "");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Toggle mobile nav via custom event from MobileDrawerToggle
  useEffect(() => {
    const handler = () => setMobileNavOpen((o) => !o);
    window.addEventListener("toggle-docs-mobile-nav", handler);
    return () => window.removeEventListener("toggle-docs-mobile-nav", handler);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("section-", "");
            setActiveSection(id);
          }
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    for (const section of sections) {
      const el = document.getElementById(`section-${section.slug}`);
      if (el) {
        sectionRefs.current.set(section.slug, el);
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [sections]);

  const handleSectionClick = useCallback((sectionSlug: string) => {
    setActiveSection(sectionSlug);
    const el = document.getElementById(`section-${sectionSlug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <DocsMobileNav
        title={title}
        slug={slug}
        sections={sections}
        sidebarItems={sidebarItems}
        activeType={activeType}
        activeSection={activeSection}
        onTypeChange={setActiveType}
        onSectionClick={handleSectionClick}
      />

      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title={title}
        slug={slug}
        sections={sections}
        sidebarItems={sidebarItems}
        activeType={activeType}
        activeSection={activeSection}
        onTypeChange={setActiveType}
        onSectionClick={handleSectionClick}
      />

      {/* Content area */}
      <div className="flex min-w-0 flex-col lg:flex-row">
        <DocsSidebarNav
          slug={slug}
          sections={sections}
          sidebarItems={sidebarItems}
          activeType={activeType}
          activeSection={activeSection}
          onTypeChange={setActiveType}
          onSectionClick={handleSectionClick}
        />

        {/* Main content */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-border-subtle bg-background px-container pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-28 lg:px-12">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground sm:gap-2 sm:text-sm">
              <Link
                href="/docs"
                className="transition-colors duration-150 hover:text-foreground"
              >
                Docs
              </Link>
              <span className="text-border">/</span>
              <span className="truncate text-foreground">{title}</span>
            </nav>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {description}
              </p>
            )}
          </div>

          {/* MDX content */}
          <div className="mx-auto max-w-container px-container py-8 sm:py-12 lg:px-12">
            <div className="prose-custom">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
