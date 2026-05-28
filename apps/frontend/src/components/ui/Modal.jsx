"use client";

import { Button } from "./Button.jsx";

export function Modal({
  children,
  description,
  footer,
  onOpenChange,
  open,
  title,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        aria-modal="true"
        className="w-full max-w-lg rounded-lg border border-border-default bg-surface p-6 shadow-modal"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            {description ? (
              <p className="text-sm text-text-muted">{description}</p>
            ) : null}
          </div>
          <Button
            aria-label="Cerrar modal"
            onClick={() => onOpenChange?.(false)}
            variant="icon"
          >
            X
          </Button>
        </div>
        <div>{children}</div>
        {footer ? (
          <footer className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
