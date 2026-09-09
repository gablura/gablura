"use client";

import { useState } from "react";
import type { Resource, ResourceType } from "@/types/resources";
import type { Role } from "@/types/roles";
import { canEditResource, canDeleteResource } from "@/types/roles";
import { deleteResource } from "@/actions/resources";
import { useDeleteConfirm } from "@/features/dashboard/hooks/use-delete-confirm";
import ResourceActions from "./resource-actions";
import DeleteConfirmModal from "./delete-confirm-modal";
import ResourceForm from "./resource-form";

interface ResourceTableProps {
  type: ResourceType;
  resources: Resource[];
  callerRole: Role;
  callerId?: string;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ResourceTable({
  type,
  resources,
  callerRole,
  callerId,
}: ResourceTableProps) {
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const { deleteId, isPending, requestDelete, cancelDelete, confirmDelete } =
    useDeleteConfirm((id) => deleteResource(type, id));

  function getPermissions(resource: Resource) {
    return {
      canEdit: canEditResource(callerRole, callerId ?? "", resource.authorId),
      canDelete: canDeleteResource(callerRole, callerId ?? "", resource.authorId),
    };
  }

  return (
    <>
      {/* Empty state */}
      {resources.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-surface p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No {type}s found. Create one to get started.
          </p>
        </div>
      )}

      {/* Desktop table */}
      {resources.length > 0 && (
        <div className="hidden rounded-xl border border-border-subtle bg-surface lg:block">
          <div className="grid grid-cols-[1fr_120px_100px_100px] gap-4 border-b border-border-subtle px-5 py-3">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              Name
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              Version
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              Status
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted text-right">
              Actions
            </span>
          </div>

          <div className="divide-y divide-border-subtle">
            {resources.map((resource) => {
              const { canEdit, canDelete } = getPermissions(resource);
              return (
                <div
                  key={resource.id}
                  className="grid grid-cols-[1fr_120px_100px_100px] gap-4 px-5 py-4 transition-colors hover:bg-surface-hover"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {resource.name}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-text-muted">
                      {resource.slug}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-accent">
                      v{resource.version}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-muted px-2 py-0.5 text-[10px] font-medium text-success">
                      <span className="size-1 rounded-full bg-success" />
                      {resource.status}
                    </span>
                  </div>
                  <div className="relative flex justify-end">
                    <ResourceActions
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onEdit={() => setEditResource(resource)}
                      onDelete={() => requestDelete(resource.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile cards */}
      {resources.length > 0 && (
        <div className="space-y-3 lg:hidden">
          {resources.map((resource) => {
            const { canEdit, canDelete } = getPermissions(resource);
            return (
              <div
                key={resource.id}
                className="rounded-xl border border-border-subtle bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {resource.name}
                      </p>
                      {resource.featured && (
                        <span className="shrink-0 rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-xs text-text-muted">
                      {resource.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <ResourceActions
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onEdit={() => setEditResource(resource)}
                      onDelete={() => requestDelete(resource.id)}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                  <span>v{resource.version}</span>
                  <span className="text-border">·</span>
                  <span>{formatDate(resource.updatedAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isPending={isPending}
        title={`Delete ${type}?`}
      />

      <ResourceForm
        type={type}
        resource={editResource}
        open={!!editResource}
        onClose={() => setEditResource(null)}
      />
    </>
  );
}
