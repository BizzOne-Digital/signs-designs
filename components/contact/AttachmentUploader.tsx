"use client";

import { useRef, useState } from "react";
import { CircleAlert, CircleCheck, FileText, ImageIcon, LoaderCircle, Paperclip, X } from "lucide-react";
import { ATTACHMENT_MIME_TYPES, MAX_QUOTE_ATTACHMENTS, MAX_UPLOAD_BYTES, TRANSPORT_SAFE_BYTES } from "@/lib/constants";
import { prepareImageForUpload } from "@/lib/client-image";
import { formatBytes } from "@/lib/format";

export type UploadedAttachment = { id: string; token: string };

type Item = {
  key: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
  id?: string;
  token?: string;
};

type Props = {
  onChange: (attachments: UploadedAttachment[]) => void;
  onBusyChange: (busy: boolean) => void;
  disabled?: boolean;
  email: string;
};

function uploadWithProgress(file: File, onProgress: (percent: number) => void): Promise<{ id: string; token: string; name: string; size: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/quote/attachments");
    xhr.responseType = "json";
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const body = xhr.response as { success?: boolean; data?: { id: string; token: string; name: string; size: number }; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300 && body?.success && body.data) resolve(body.data);
      else if (xhr.status === 413) reject(new Error("This file is too large to upload."));
      else reject(new Error(body?.error || "Upload failed. Please try again."));
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

export function AttachmentUploader({ onChange, onBusyChange, disabled, email }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const keyCounter = useRef(0);

  const commit = (next: Item[]) => {
    itemsRef.current = next;
    setItems(next);
    onChange(next.filter((i) => i.status === "done" && i.id && i.token).map((i) => ({ id: i.id!, token: i.token! })));
    onBusyChange(next.some((i) => i.status === "uploading"));
  };

  const patch = (key: string, changes: Partial<Item>) => {
    commit(itemsRef.current.map((item) => (item.key === key ? { ...item, ...changes } : item)));
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || disabled) return;
    const room = MAX_QUOTE_ATTACHMENTS - itemsRef.current.filter((i) => i.status !== "error").length;
    const files = Array.from(fileList).slice(0, Math.max(0, room));

    for (const original of files) {
      const key = `file-${++keyCounter.current}`;
      const base: Item = { key, name: original.name, size: original.size, type: original.type, status: "uploading", progress: 0 };

      let error: string | undefined;
      if (!(ATTACHMENT_MIME_TYPES as readonly string[]).includes(original.type)) error = "Only PNG, JPG, WEBP or PDF files are accepted.";
      else if (original.size > MAX_UPLOAD_BYTES) error = "Files must be 8 MB or smaller.";
      else if (original.type === "application/pdf" && original.size > TRANSPORT_SAFE_BYTES)
        error = `PDFs must be under 4 MB for online upload. Email larger files to ${email}.`;

      if (error) {
        commit([...itemsRef.current, { ...base, status: "error", error }]);
        continue;
      }

      commit([...itemsRef.current, base]);
      try {
        const prepared = await prepareImageForUpload(original);
        const result = await uploadWithProgress(prepared, (progress) => patch(key, { progress }));
        patch(key, { status: "done", progress: 100, id: result.id, token: result.token, size: result.size });
      } catch (uploadError) {
        patch(key, { status: "error", error: uploadError instanceof Error ? uploadError.message : "Upload failed." });
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (item: Item) => {
    commit(itemsRef.current.filter((i) => i.key !== item.key));
    if (item.status === "done" && item.id && item.token) {
      void fetch("/api/quote/attachments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, token: item.token }),
      }).catch(() => undefined);
    }
  };

  const activeCount = items.filter((i) => i.status !== "error").length;
  const full = activeCount >= MAX_QUOTE_ATTACHMENTS;

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!full) void handleFiles(event.dataTransfer.files);
        }}
        className={`relative rounded-[var(--radius-card)] border-2 border-dashed px-5 py-7 text-center transition ${
          dragging ? "border-brand bg-brand/5" : "border-ink/15 bg-fog/60 hover:border-ink/30"
        } ${full || disabled ? "opacity-60" : ""}`}
      >
        <Paperclip className="mx-auto size-7 text-brand-deep" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold text-ink">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={full || disabled}
            className="font-bold text-brand-deep underline decoration-2 underline-offset-4 hover:text-brand disabled:no-underline"
          >
            Choose files
          </button>{" "}
          or drag them here
        </p>
        <p className="mt-1 text-xs text-steel">Logos, artwork, blueprints or reference photos — PNG, JPG, WEBP or PDF, up to 8 MB each ({MAX_QUOTE_ATTACHMENTS} files max).</p>
        <input
          ref={inputRef}
          id="quote-files"
          type="file"
          multiple
          accept={ATTACHMENT_MIME_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => void handleFiles(event.target.files)}
          disabled={full || disabled}
          aria-label="Upload project files"
        />
      </div>

      {items.length > 0 ? (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {items.map((item) => {
            const Icon = item.type === "application/pdf" ? FileText : ImageIcon;
            return (
              <li key={item.key} className="rounded-[4px] border border-ink/10 bg-white px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 shrink-0 text-steel" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                    <p className={`text-xs ${item.status === "error" ? "text-brand-deep" : "text-steel"}`}>
                      {item.status === "uploading" && `Uploading… ${item.progress}%`}
                      {item.status === "done" && `Uploaded · ${formatBytes(item.size)}`}
                      {item.status === "error" && item.error}
                    </p>
                  </div>
                  {item.status === "uploading" ? <LoaderCircle className="size-5 animate-spin text-steel" aria-label="Uploading" /> : null}
                  {item.status === "done" ? <CircleCheck className="size-5 text-emerald-600" aria-label="Uploaded" /> : null}
                  {item.status === "error" ? <CircleAlert className="size-5 text-brand-deep" aria-label="Upload failed" /> : null}
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    disabled={item.status === "uploading"}
                    className="rounded p-1 text-steel transition hover:bg-fog hover:text-ink disabled:opacity-40"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
                {item.status === "uploading" ? (
                  <div className="mt-2 h-1 overflow-hidden rounded bg-fog" aria-hidden="true">
                    <div className="h-full bg-brand transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
