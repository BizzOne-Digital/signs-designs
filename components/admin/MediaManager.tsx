"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useApiData } from "@/lib/use-api-data";
import { Copy, ExternalLink, RefreshCw, Trash2, Upload } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { AdminCard, AdminPageHeader, Badge, EmptyState, IconButton, Spinner, adminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiRequest, errorMessage } from "@/lib/admin-client";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/constants";
import { formatBytes, formatDate } from "@/lib/format";
import type { MediaItemDTO } from "@/lib/types";

export function MediaManager() {
  const toast = useToast();
  const { data: items, setData: setItems, error: loadError, loading: refreshing, reload: load } = useApiData<MediaItemDTO[]>("/api/admin/media");
  const [folder, setFolder] = useState<"all" | UploadFolder>("all");
  const [usage, setUsage] = useState<"all" | "used" | "unused">("all");
  const [pendingDelete, setPendingDelete] = useState<MediaItemDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<UploadFolder>("gallery");
  const [uploaderKey, setUploaderKey] = useState(0);

  const visible = useMemo(
    () => (items ?? []).filter((i) => (folder === "all" || i.folder === folder) && (usage === "all" || (usage === "used" ? i.inUse : !i.inUse))),
    [items, folder, usage],
  );

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Image URL copied.");
    } catch {
      toast.error("Could not copy. Select the URL and copy it manually.");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/admin/media/${pendingDelete._id}`, { method: "DELETE" });
      setItems((current) => (current ?? []).filter((i) => i._id !== pendingDelete._id));
      toast.success("Image deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalSize = (items ?? []).reduce((sum, i) => sum + i.size, 0);
  const unusedCount = (items ?? []).filter((i) => !i.inUse).length;

  return (
    <>
      <AdminPageHeader
        title="Media"
        description={`Images stored in MongoDB. ${items ? `${items.length} files · ${formatBytes(totalSize)}` : ""}`}
        actions={
          <Button variant="outline-dark" onClick={() => void load()} disabled={refreshing}>
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" /> Refresh
          </Button>
        }
      />

      <AdminCard className="mb-6 p-5">
        <div className="flex items-center gap-2">
          <Upload className="size-4 text-brand-deep" aria-hidden="true" />
          <h2 className="font-display text-sm font-extrabold tracking-[0.1em]">Upload to library</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[12rem_1fr]">
          <div>
            <label htmlFor="media-folder" className="mb-1.5 block text-xs font-bold tracking-[0.08em] text-graphite uppercase">
              Folder
            </label>
            <select id="media-folder" className={adminInput} value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value as UploadFolder)}>
              {UPLOAD_FOLDERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-steel">After uploading, copy the URL and paste it into any image field.</p>
          </div>
          <LocalImageField
            key={uploaderKey}
            folder={uploadFolder}
            value=""
            onChange={(url) => {
              if (!url) return;
              setUploaderKey((k) => k + 1);
              void load();
              void copyUrl(url);
            }}
          />
        </div>
      </AdminCard>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by folder" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {(["all", ...UPLOAD_FOLDERS] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFolder(f)}
              aria-pressed={folder === f}
              className={`shrink-0 rounded-[3px] border px-3 py-1.5 text-xs font-bold uppercase transition ${folder === f ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-graphite hover:border-ink/40"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <select aria-label="Filter by usage" className={`${adminInput} sm:w-48`} value={usage} onChange={(e) => setUsage(e.target.value as typeof usage)}>
          <option value="all">All images</option>
          <option value="used">In use</option>
          <option value="unused">Unused ({unusedCount})</option>
        </select>
      </div>

      {loadError ? (
        <EmptyState title="Could not load media" text={loadError} action={<Button onClick={() => void load()}>Retry</Button>} />
      ) : items === null ? (
        <Spinner label="Loading media" />
      ) : visible.length === 0 ? (
        <EmptyState title="No images here" text="Images you upload in the admin panel appear in this library." />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((item) => (
            <li key={item._id} className="overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-square bg-fog" aria-label={`Open ${item.filename}`}>
                <Image src={item.url} alt="" fill unoptimized sizes="240px" className="object-cover" loading="lazy" />
                <span className="absolute top-2 left-2">
                  <Badge tone={item.inUse ? "green" : "gray"}>{item.inUse ? "In use" : "Unused"}</Badge>
                </span>
              </a>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-ink" title={item.filename}>
                  {item.filename}
                </p>
                <p className="mt-0.5 text-[0.7rem] text-steel">
                  {item.folder} · {formatBytes(item.size)} · {formatDate(item.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <div className="mt-2.5 flex gap-1.5">
                  <IconButton label="Copy URL" onClick={() => void copyUrl(item.url)}>
                    <Copy className="size-4" aria-hidden="true" />
                  </IconButton>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex size-9 items-center justify-center rounded-[4px] border border-ink/10 text-graphite hover:bg-fog" aria-label="Preview full size" title="Preview full size">
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                  <IconButton label={item.inUse ? "In use — remove it from content first" : "Delete image"} tone="danger" onClick={() => setPendingDelete(item)} disabled={item.inUse}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </IconButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete image?"
        message={`${pendingDelete?.filename ?? ""} will be permanently removed from the database.`}
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
