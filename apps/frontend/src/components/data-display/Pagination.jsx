"use client";

import { Button } from "@/components/ui";

export function Pagination({
  onPageChange,
  page = 1,
  pageSize = 10,
  totalItems = 0,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col gap-3 border-t border-border-default bg-surface px-4 py-3 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between"
    >
      <span>
        Página {page} de {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          disabled={!canGoPrevious}
          onClick={() => onPageChange?.(page - 1)}
          variant="secondary"
        >
          Anterior
        </Button>
        <Button
          disabled={!canGoNext}
          onClick={() => onPageChange?.(page + 1)}
          variant="secondary"
        >
          Siguiente
        </Button>
      </div>
    </nav>
  );
}
