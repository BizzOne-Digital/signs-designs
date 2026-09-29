"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { prepareImageForUpload } from "@/lib/client-image";
import { MAX_UPLOAD_BYTES, TRANSPORT_SAFE_BYTES, type UploadFolder } from "@/lib/constants";
import { normalizeImageUrl } from "@/lib/images";
import { formatBytes } from "@/lib/format";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;

type UploadResult = { success: true; url: string; filename: string; size: number; folder: UploadFolder };

export type LocalImageFieldProps = {
  value?: string;
  folder: UploadFolder;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  help?: string;
  compact?: boolean;
  aspect?: string;
};

function uploadFile(file: File, folder: UploadFolder, onProgress: (percent: number) => void): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.responseType = "json";
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const body = xhr.response as (UploadResult & { error?: string }) | { success: false; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300 && body && body.success) return resolve(body as UploadResult);
      if (xhr.status === 401) return reject(new Error("Your session has expired. Please sign in again."));
      if (xhr.status === 413) return reject(new Error("This file is too large to upload."));
      reject(new Error((body && "error" in body && body.error) || "Upload failed. Please try again."));
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}

/** Deletes an upload that was never saved to content. The server refuses if anything references it. */
function discardUnsavedUpload(url: string) {
  void fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => undefined);
}

/**
 * Reusable admin image input. Uploads to MongoDB via POST /api/upload and returns ONLY the saved URL
 * through onChange — binary data and base64 never enter content documents.
 */
export function LocalImageField({ value = "", folder, onChange, label, required, help, compact = false, aspect = "aspect-[16/10]" }: LocalImageFieldProps) {
  const toast = useToast();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const savedValue = useRef(value);
  const sessionUpload = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [lastUpload, setLastUpload] = useState<{ name: string; size: number } | null>(null);
  const [manualUrl, setManualUrl] = useState("");

  const validate = (file: File): string | null => {
    if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) return "Use a PNG, JPG, WEBP or GIF image.";
    if (file.size > MAX_UPLOAD_BYTES) return `Images must be 8 MB or smaller (this one is ${formatBytes(file.size)}).`;
    if (file.type === "image/gif" && file.size > TRANSPORT_SAFE_BYTES) return "GIFs must be under 4 MB so they can upload without losing animation.";
    return null;
  };

  const handleFile = async (file: File | undefined) => {
    if (!file || uploading) return;
    setError("");
    const problem = validate(file);
    if (problem) {
      setError(problem);
      toast.error(problem);
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const prepared = await prepareImageForUpload(file);
      const uploaded = await uploadFile(prepared, folder, setProgress);

      const previousSessionUpload = sessionUpload.current;
      sessionUpload.current = uploaded.url;
      onChange(uploaded.url);
      setLastUpload({ name: file.name, size: uploaded.size });
      toast.success("Image uploaded. Save to publish the change.");

      // A replaced image that was uploaded in this session (never saved) can be discarded now.
      if (previousSessionUpload && previousSessionUpload !== savedValue.current) discardUnsavedUpload(previousSessionUpload);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    if (value && value === sessionUpload.current && value !== savedValue.current) {
      discardUnsavedUpload(value);
      sessionUpload.current = null;
    }
    // Saved images are deleted server-side only after the content update succeeds.
    onChange("");
    setLastUpload(null);
    setError("");
  };

  const applyManualUrl = () => {
    const url = manualUrl.trim();
    if (!url) return;
    if (!url.startsWith("/api/uploads/") && !url.startsWith("https://images.unsplash.com/")) {
      setError("Paste a URL from the Media library (/api/uploads/...) or an images.unsplash.com link.");
      return;
    }
    setError("");
    onChange(url);
    setManualUrl("");
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      {label ? (
        <p className="mb-1.5 text-xs font-bold tracking-[0.08em] text-graphite uppercase">
          {label}
          {required ? <span className="ml-0.5 text-brand-deep">*</span> : null}
        </p>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => void handleFile(event.target.files?.[0])}
        aria-label={label ? `Upload ${label}` : "Upload image"}
      />

      {value ? (
        <div className="overflow-hidden rounded-[4px] border border-ink/10 bg-fog">
          <div className={`relative ${compact ? "aspect-square" : aspect} bg-[conic-gradient(#eee_25%,#fff_0_50%,#eee_0_75%,#fff_0)] bg-[length:16px_16px]`}>
            <Image src={normalizeImageUrl(value)} alt={label ? `${label} preview` : "Image preview"} fill unoptimized sizes="400px" className="object-cover" />
            {uploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70 text-sm font-semibold text-white">
                <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
                Uploading {progress}%
              </div>
            ) : null}
          </div>
          <div className={`flex items-center gap-2 border-t border-ink/10 bg-white ${compact ? "p-1.5" : "p-2"}`}>
            {!compact ? (
              <p className="min-w-0 flex-1 truncate px-1 text-xs text-steel" title={value}>
                {lastUpload ? `${lastUpload.name} · ${formatBytes(lastUpload.size)}` : value.startsWith("/api/uploads/") ? "Uploaded image" : "External placeholder image"}
              </p>
            ) : null}
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className={`inline-flex items-center justify-center gap-1.5 rounded-[3px] border border-ink/15 text-xs font-bold text-ink uppercase transition hover:bg-fog disabled:opacity-50 ${compact ? "size-8 flex-1" : "px-2.5 py-1.5"}`}
              aria-label="Replace image"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              {compact ? null : "Replace"}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className={`inline-flex items-center justify-center gap-1.5 rounded-[3px] border border-brand/25 text-xs font-bold text-brand-deep uppercase transition hover:bg-brand hover:text-white disabled:opacity-50 ${compact ? "size-8 flex-1" : "px-2.5 py-1.5"}`}
              aria-label="Remove image"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              {compact ? null : "Remove"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleFile(event.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-[4px] border-2 border-dashed text-center transition ${compact ? "aspect-square p-3" : "px-4 py-8"} ${
            dragging ? "border-brand bg-brand/5" : error ? "border-brand-deep/60 bg-brand/[0.03]" : "border-ink/15 bg-fog/50 hover:border-ink/40 hover:bg-fog"
          }`}
        >
          {uploading ? (
            <>
              <LoaderCircle className="size-6 animate-spin text-steel" aria-hidden="true" />
              <span className="text-xs font-semibold text-graphite">Uploading {progress}%</span>
              <span className="h-1 w-32 overflow-hidden rounded bg-ink/10" aria-hidden="true">
                <span className="block h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
              </span>
            </>
          ) : compact ? (
            <>
              <ImagePlus className="size-6 text-steel" aria-hidden="true" />
              <span className="text-xs font-semibold text-graphite">Add image</span>
            </>
          ) : (
            <>
              <UploadCloud className="size-7 text-steel" aria-hidden="true" />
              <span className="text-sm font-semibold text-ink">Click to upload or drag an image here</span>
              <span className="text-xs text-steel">PNG, JPG, WEBP or GIF · up to 8 MB</span>
            </>
          )}
        </button>
      )}

      {!compact ? (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(event) => setManualUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyManualUrl();
              }
            }}
            placeholder="Or paste a Media library URL"
            aria-label="Image URL"
            className="min-w-0 flex-1 rounded-[3px] border border-ink/10 px-2.5 py-1.5 text-xs text-ink placeholder:text-steel/70 focus:border-ink focus:outline-none"
          />
          <button type="button" onClick={applyManualUrl} className="rounded-[3px] border border-ink/15 px-2.5 text-xs font-bold text-ink uppercase hover:bg-fog">
            Use
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-brand-deep" role="alert">
          {error}
        </p>
      ) : help ? (
        <p className="mt-1.5 text-xs text-steel">{help}</p>
      ) : null}
    </div>
  );
}
