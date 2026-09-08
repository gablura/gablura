"use client";

import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import type { Resource } from "@/types/resources";
import type { Role } from "@/types/roles";
import ResourceTable from "@/features/dashboard/components/resource-table";
import ResourceForm from "@/features/dashboard/components/resource-form";

export default function SdksPageClient({
  resources,
  callerRole,
  callerId,
}: {
  resources: Resource[];
  callerRole: Role;
  callerId?: string;
}) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resources.length} {resources.length === 1 ? "SDK" : "SDKs"}
        </p>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:bg-primary/85"
        >
          <HiOutlinePlus className="size-4" />
          New SDK
        </button>
      </div>

      <ResourceTable
        type="sdk"
        resources={resources}
        callerRole={callerRole}
        callerId={callerId}
      />

      <ResourceForm
        type="sdk"
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </>
  );
}
