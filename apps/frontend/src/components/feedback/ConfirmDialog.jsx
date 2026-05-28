"use client";

import { Button, Modal } from "@/components/ui";

export function ConfirmDialog({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  description,
  loading = false,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  title,
  variant = "danger",
}) {
  return (
    <Modal
      description={description}
      footer={
        <>
          <Button onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button loading={loading} onClick={onConfirm} variant={variant}>
            {confirmLabel}
          </Button>
        </>
      }
      onOpenChange={onOpenChange}
      open={open}
      title={title}
    />
  );
}
