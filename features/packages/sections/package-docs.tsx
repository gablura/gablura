"use client";

import { useState } from "react";
import type { Resource } from "@/types/resources";
import PackageOverview from "./tabs/package-overview";
import PackageInstallation from "./tabs/package-installation";
import PackageApiReference from "./tabs/package-api-reference";
import PackageExamples from "./tabs/package-examples";

interface PackageDocsProps {
  pkg: Resource;
}

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "installation", label: "Installation" },
  { key: "api", label: "API Reference" },
  { key: "examples", label: "Examples" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function PackageDocs({ pkg }: PackageDocsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="package-docs-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <h2 id="package-docs-heading" className="sr-only">
          Documentation
        </h2>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === "overview" && <PackageOverview pkg={pkg} />}
          {activeTab === "installation" && <PackageInstallation pkg={pkg} />}
          {activeTab === "api" && <PackageApiReference pkg={pkg} />}
          {activeTab === "examples" && <PackageExamples pkg={pkg} />}
        </div>
      </div>
    </section>
  );
}
