"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type DeleteAction = (id: string) => Promise<{ error?: string }>;

export function useDeleteConfirm(deleteAction: DeleteAction) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function requestDelete(id: string) {
    setDeleteId(id);
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteAction(deleteId);
      if (result.error) {
        alert(result.error);
      }
      setDeleteId(null);
      router.refresh();
    });
  }

  return {
    deleteId,
    isPending,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
