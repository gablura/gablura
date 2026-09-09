"use client";

import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import type { Project } from "@/types/projects";
import type { Role } from "@/types/roles";
import { canEditResource, canDeleteResource } from "@/types/roles";
import { deleteProject } from "@/actions/projects";
import { useDeleteConfirm } from "@/features/dashboard/hooks/use-delete-confirm";
import ResourceActions from "@/features/dashboard/components/resource-actions";
import DeleteConfirmModal from "@/features/dashboard/components/delete-confirm-modal";
import ProjectForm from "@/features/dashboard/components/project-form";

interface ProjectsPageClientProps {
  projects: Project[];
  callerRole: Role;
  callerId?: string;
}

export default function ProjectsPageClient({
  projects,
  callerRole,
  callerId,
}: ProjectsPageClientProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const { deleteId, isPending, requestDelete, cancelDelete, confirmDelete } =
    useDeleteConfirm(deleteProject);

  function getPermissions(project: Project) {
    return {
      canEdit: canEditResource(callerRole, callerId ?? "", project.authorId),
      canDelete: canDeleteResource(callerRole, callerId ?? "", project.authorId),
    };
  }

  function getStatusClasses(status: Project["status"]) {
    if (status === "active") return "bg-success-muted text-success";
    if (status === "in-development") return "bg-warning-muted text-warning";
    return "bg-surface-elevated text-text-muted";
  }

  function getStatusDot(status: Project["status"]) {
    if (status === "active") return "bg-success";
    if (status === "in-development") return "bg-warning";
    return "bg-text-muted";
  }

  function getStatusLabel(status: Project["status"]) {
    if (status === "in-development") return "In Dev";
    return status;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:bg-primary/85"
        >
          <HiOutlinePlus className="size-4" />
          New project
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-surface p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No projects yet. Create one to get started.
          </p>
        </div>
      )}

      {/* Desktop table */}
      {projects.length > 0 && (
        <div className="hidden rounded-xl border border-border-subtle bg-surface lg:block">
          <div className="grid grid-cols-[1fr_120px_100px_100px] gap-4 border-b border-border-subtle px-5 py-3">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              Name
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              Status
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              Featured
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted text-right">
              Actions
            </span>
          </div>

          <div className="divide-y divide-border-subtle">
            {projects.map((project) => {
              const { canEdit, canDelete } = getPermissions(project);
              return (
                <div
                  key={project.id}
                  className="grid grid-cols-[1fr_120px_100px_100px] gap-4 px-5 py-4 transition-colors hover:bg-surface-hover"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {project.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      {project.tagline}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusClasses(project.status)}`}
                    >
                      <span
                        className={`size-1 rounded-full ${getStatusDot(project.status)}`}
                      />
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {project.featured ? (
                      <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </div>
                  <div className="flex items-center justify-end">
                    <ResourceActions
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onEdit={() => setEditProject(project)}
                      onDelete={() => requestDelete(project.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile cards */}
      {projects.length > 0 && (
        <div className="space-y-3 lg:hidden">
          {projects.map((project) => {
            const { canEdit, canDelete } = getPermissions(project);
            return (
              <div
                key={project.id}
                className="rounded-xl border border-border-subtle bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {project.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      {project.tagline}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <ResourceActions
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onEdit={() => setEditProject(project)}
                      onDelete={() => requestDelete(project.id)}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusClasses(project.status)}`}
                  >
                    <span
                      className={`size-1 rounded-full ${getStatusDot(project.status)}`}
                    />
                    {getStatusLabel(project.status)}
                  </span>
                  {project.featured && (
                    <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      Featured
                    </span>
                  )}
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
        title="Delete project?"
      />

      <ProjectForm open={formOpen} onClose={() => setFormOpen(false)} />
      <ProjectForm
        project={editProject}
        open={!!editProject}
        onClose={() => setEditProject(null)}
      />
    </>
  );
}
