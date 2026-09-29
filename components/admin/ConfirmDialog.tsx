"use client";

import { LoaderCircle } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, message, confirmLabel = "Delete", busy, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={busy ? () => undefined : onCancel}
      title={title}
      size="md"
      footer={
        <>
          <Button variant="outline-dark" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-graphite">{message}</p>
    </Modal>
  );
}
