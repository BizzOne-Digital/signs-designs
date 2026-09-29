"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; message: string };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const STYLES: Record<ToastKind, { icon: typeof Info; accent: string }> = {
  success: { icon: CircleCheck, accent: "text-emerald-400" },
  error: { icon: CircleAlert, accent: "text-brand-bright" },
  info: { icon: Info, accent: "text-white/80" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const regionRef = useRef<HTMLDivElement>(null);

  // Render in the browser top layer so toasts stay visible above open modal <dialog>s.
  useEffect(() => {
    const region = regionRef.current;
    if (!region || typeof region.showPopover !== "function") return;
    try {
      if (region.matches(":popover-open")) region.hidePopover();
      if (toasts.length > 0) region.showPopover();
    } catch {
      // Popover API unsupported: the fixed-position region still displays normally.
    }
  }, [toasts]);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-3), { id, kind, message }]);
      window.setTimeout(() => dismiss(id), kind === "error" ? 7000 : 4500);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        ref={regionRef}
        popover="manual"
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 top-auto bottom-20 z-[100] m-0 flex h-auto w-auto flex-col items-center gap-2 overflow-visible border-0 bg-transparent px-4 sm:bottom-6 sm:items-end sm:px-6"
      >
        {toasts.map((toast) => {
          const { icon: Icon, accent } = STYLES[toast.kind];
          return (
            <div
              key={toast.id}
              role={toast.kind === "error" ? "alert" : "status"}
              className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-[var(--radius-card)] border border-white/10 bg-charcoal px-4 py-3 text-sm text-white shadow-lift"
            >
              <Icon className={`mt-0.5 size-5 shrink-0 ${accent}`} aria-hidden="true" />
              <p className="flex-1 leading-6">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="-mr-1 rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
