"use client";

import { useState, useMemo } from "react";
import type { Developer } from "@/features/dashboard/components/developers/types";
import { DeveloperDetail } from "@/features/dashboard/components/developers/developer-detail";
import { DeveloperFilters } from "@/features/dashboard/components/developers/developer-filters";
import { DeveloperStatsRow } from "@/features/dashboard/components/developers/developer-stats-row";
import { DevelopersDesktopTable } from "@/features/dashboard/components/developers/developers-desktop-table";
import { DevelopersMobileCards } from "@/features/dashboard/components/developers/developers-mobile-cards";

interface DevelopersPageClientProps {
  developers: Developer[];
  counts: Record<string, number>;
}

export default function DevelopersPageClient({
  developers,
  counts,
}: DevelopersPageClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDeveloper, setSelectedDeveloper] =
    useState<Developer | null>(null);

  const filtered = useMemo(() => {
    return developers.filter((d) => {
      const matchesSearch =
        search === "" ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.primaryStack.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [developers, search, statusFilter]);

  const handleSelect = (dev: Developer) => {
    setSelectedDeveloper(
      selectedDeveloper?.email === dev.email ? null : dev
    );
  };

  return (
    <div className="space-y-6">
      <DeveloperStatsRow total={developers.length} counts={counts} />

      <DeveloperFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <DevelopersDesktopTable
        developers={filtered}
        selectedEmail={selectedDeveloper?.email ?? null}
        onSelect={handleSelect}
      />

      <DevelopersMobileCards
        developers={filtered}
        onSelect={handleSelect}
      />

      {selectedDeveloper && (
        <div className="rounded-xl border border-border-subtle bg-surface p-6">
          <DeveloperDetail developer={selectedDeveloper} />
        </div>
      )}
    </div>
  );
}
