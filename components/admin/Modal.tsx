"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl";
};

const SIZES = { md: "max-w-lg", lg: "max-w-3xl", xl: "max-w-5xl" };

/** Accessible modal built on the native <dialog> element (focus trap and Escape handled by the browser). */
export function Modal({ open, onClose, title, description, children, footer, size = "lg" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby={titleId}
      className={`m-auto max-h-[92svh] w-[calc(100%-1.5rem)] ${SIZES[size]} overflow-hidden rounded-[var(--radius-card)] bg-white p-0 text-ink shadow-2xl open:flex open:flex-col`}
    >
      {open ? (
        <>
          <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
            <div>
              <h2 id={titleId} className="font-display text-lg font-extrabold">
                {title}
              </h2>
              {description ? <p className="mt-0.5 text-sm text-steel">{description}</p> : null}
            </div>
            <button type="button" onClick={onClose} className="rounded p-1.5 text-steel transition hover:bg-fog hover:text-ink" aria-label="Close">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          {footer ? <div className="flex flex-col-reverse gap-2 border-t border-ink/10 bg-fog/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">{footer}</div> : null}
        </>
      ) : null}
    </dialog>
  );
}
