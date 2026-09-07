"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteResource } from "@/actions/resources";
import type { Resource, ResourceType } from "@/types/resources";
import ResourceForm from "./resource-form";

interface ResourceTableProps {
  type: ResourceType;
  resources: Resource[];
  callerRole: "owner" | "admin" | "moderator" | "user";
}

function canEdit(callerRole: string, resource: Resource, callerId?: string): boolean {
  if (callerRole === "owner") return true;
  return resource.authorId === callerId;
}

export default function ResourceTable({
  type,
  resources,
  callerRole,
}: ResourceTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteResource(type, deleteId);
      if (result.error) {
        alert(result.error);
      }
      setDeleteId(null);
      router.refresh();
    });
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden rounded-xl border border-border-subtle bg-surface lg:block">
        <div className="grid grid-cols-[1fr_100px_90px_90px_48px] items-center gap-4 border-b border-border-subtle bg-surface-elevated/50 px-5 py-3">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Name
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Version
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Status
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Updated
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted text-right">
            Actions
          </span>
        </div>

        <div className="divide-y divide-border-subtle">
          {resources.map((resource) => {
            const isOwner = canEdit(callerRole, resource);
            const updatedDate = new Date(resource.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={resource.id}
                className="group grid grid-cols-[1fr_100px_90px_90px_48px] items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-elevated/50"
              >
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
                  <p className="truncate text-xs text-text-muted">
                    {resource.slug}
                  </p>
                </div>

                <span className="font-mono text-xs text-muted-foreground">
                  {resource.version}
                </span>

                <span
                  className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                    resource.status === "published"
                      ? "border-success-border bg-success-muted text-success"
                      : "border-border bg-surface-elevated text-text-muted"
                  }`}
                >
                  {resource.status}
                </span>

                <span className="text-xs text-text-muted">{updatedDate}</span>

                <div className="relative flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditResource(resource)}
                    className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                    aria-label="Edit"
                  >
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDelete(resource.id)}
                      className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-error-muted hover:text-error"
                      aria-label="Delete"
                    >
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {resources.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">No {type}s found.</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {resources.map((resource) => {
          const isOwner = canEdit(callerRole, resource);
          const updatedDate = new Date(resource.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

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
                  <button
                    type="button"
                    onClick={() => setEditResource(resource)}
                    className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                    aria-label="Edit"
                  >
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDelete(resource.id)}
                      className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-error-muted hover:text-error"
                      aria-label="Delete"
                    >
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-text-muted">
                  v{resource.version}
                </span>
                <span
                  className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${
                    resource.status === "published"
                      ? "border-success-border bg-success-muted text-success"
                      : "border-border bg-surface-elevated text-text-muted"
                  }`}
                >
                  {resource.status}
                </span>
                <span className="ml-auto text-[11px] text-text-muted">
                  {updatedDate}
                </span>
              </div>

              {resource.description && (
                <p className="mt-2 line-clamp-2 text-xs text-text-muted">
                  {resource.description}
                </p>
              )}
            </div>
          );
        })}

        {resources.length === 0 && (
          <div className="rounded-xl border border-border-subtle bg-surface px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">No {type}s found.</p>
          </div>
        )}
      </div>

      {/* Edit form */}
      <ResourceForm
        type={type}
        resource={editResource}
        open={!!editResource}
        onClose={() => setEditResource(null)}
      />

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative mx-4 w-full max-w-sm rounded-xl border border-border-subtle bg-surface p-5 shadow-lg">
            <h3 className="text-base font-semibold text-foreground">
              Delete {type}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this {type}? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isPending}
                className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/85 disabled:opacity-50"
              >
                {isPending && (
                  <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
