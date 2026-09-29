"use client";

import { useCallback, useMemo, useState } from "react";
import { useApiData } from "@/lib/use-api-data";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Download, Eye, FileText, ImageIcon, LoaderCircle, Mail, MapPin, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPageHeader, Badge, EmptyState, Field, Spinner, STATUS_TONES, adminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiRequest, errorMessage } from "@/lib/admin-client";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/constants";
import { formatBytes, formatDateTime, telHref } from "@/lib/format";
import type { QuoteRequestDTO } from "@/lib/types";

const STATUS_LABELS: Record<QuoteStatus, string> = { new: "New", contacted: "Contacted", quoted: "Quoted", closed: "Closed" };

type ListResponse = { items: QuoteRequestDTO[]; counts: Record<QuoteStatus, number> };

export function InquiriesManager() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");
  const [status, setStatus] = useState<"all" | QuoteStatus>(initialStatus && (QUOTE_STATUSES as readonly string[]).includes(initialStatus) ? (initialStatus as QuoteStatus) : "all");
  const { data, setData, error: loadError, loading: refreshing, reload: load } = useApiData<ListResponse>("/api/admin/inquiries");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<QuoteRequestDTO | null>(null);
  const [edit, setEdit] = useState<{ status: QuoteStatus; adminNotes: string }>({ status: "new", adminNotes: "" });
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<QuoteRequestDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openDetail = useCallback((item: QuoteRequestDTO) => {
    setSelected(item);
    setEdit({ status: item.status, adminNotes: item.adminNotes });
  }, []);

  // Deep link from the dashboard: /admin/inquiries?open=<id>
  const openId = searchParams.get("open");
  const [handledOpenId, setHandledOpenId] = useState<string | null>(null);
  if (data && openId && handledOpenId !== openId) {
    setHandledOpenId(openId);
    const match = data.items.find((i) => i.id === openId);
    if (match) openDetail(match);
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.items ?? []).filter(
      (i) =>
        (status === "all" || i.status === status) &&
        (!q || [i.name, i.businessName, i.email, i.phone, i.service, i.location].some((v) => v.toLowerCase().includes(q))),
    );
  }, [data, status, query]);

  const replaceLocal = (updated: QuoteRequestDTO, previousStatus?: QuoteStatus) =>
    setData((current) => {
      if (!current) return current;
      const counts = { ...current.counts };
      if (previousStatus && previousStatus !== updated.status) {
        counts[previousStatus] = Math.max(0, counts[previousStatus] - 1);
        counts[updated.status] = (counts[updated.status] ?? 0) + 1;
      }
      return { counts, items: current.items.map((i) => (i.id === updated.id ? updated : i)) };
    });

  const saveDetail = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await apiRequest<QuoteRequestDTO>(`/api/admin/inquiries/${selected.id}`, { method: "PATCH", body: edit });
      replaceLocal(updated, selected.status);
      setSelected(updated);
      toast.success("Inquiry updated.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not update the inquiry."));
    } finally {
      setSaving(false);
    }
  };

  const quickStatus = async (item: QuoteRequestDTO, next: QuoteStatus) => {
    try {
      const updated = await apiRequest<QuoteRequestDTO>(`/api/admin/inquiries/${item.id}`, { method: "PATCH", body: { status: next } });
      replaceLocal(updated, item.status);
      toast.success(`Marked as ${STATUS_LABELS[next].toLowerCase()}.`);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/admin/inquiries/${pendingDelete.id}`, { method: "DELETE" });
      setData((current) =>
        current
          ? {
              items: current.items.filter((i) => i.id !== pendingDelete.id),
              counts: { ...current.counts, [pendingDelete.status]: Math.max(0, current.counts[pendingDelete.status] - 1) },
            }
          : current,
      );
      if (selected?.id === pendingDelete.id) setSelected(null);
      toast.success("Inquiry deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    if (openId) router.replace("/admin/inquiries");
  };

  const total = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;
  const statusSelect = (item: QuoteRequestDTO) => (
    <select
      value={item.status}
      onChange={(e) => void quickStatus(item, e.target.value as QuoteStatus)}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Status for ${item.name}`}
      className="rounded-[3px] border border-ink/15 bg-white px-2 py-1 text-xs font-semibold"
    >
      {QUOTE_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <AdminPageHeader
        title="Quote Requests"
        description="Every quote form submission from the website. Update the status as you follow up."
        actions={
          <Button variant="outline-dark" onClick={() => void load()} disabled={refreshing}>
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div role="group" aria-label="Filter by status" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(["all", ...QUOTE_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`shrink-0 rounded-[3px] border px-3 py-1.5 text-xs font-bold uppercase transition ${status === s ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-graphite hover:border-ink/40"}`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]} ({s === "all" ? total : (data?.counts[s] ?? 0)})
            </button>
          ))}
        </div>
        <div className="relative xl:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone…" aria-label="Search quote requests" className={`${adminInput} pl-9`} />
        </div>
      </div>

      {loadError ? (
        <EmptyState title="Could not load quote requests" text={loadError} action={<Button onClick={() => void load()}>Retry</Button>} />
      ) : data === null ? (
        <Spinner label="Loading quote requests" />
      ) : visible.length === 0 ? (
        <EmptyState title="No quote requests" text={total === 0 ? "Submissions from the Contact page will appear here." : "No requests match this filter."} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/10 bg-fog/70 text-xs font-bold tracking-wide text-graphite uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Business</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Phone</th>
                  <th scope="col" className="px-4 py-3">Service</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {visible.map((item) => (
                  <tr key={item.id} className={`transition hover:bg-fog/50 ${item.status === "new" ? "bg-brand/[0.025]" : ""}`}>
                    <td className="px-4 py-3 font-semibold text-ink">
                      <span className="flex items-center gap-2">
                        {item.status === "new" ? <span className="size-2 rounded-full bg-brand" aria-label="New" /> : null}
                        {item.name}
                      </span>
                    </td>
                    <td className="max-w-40 truncate px-4 py-3 text-graphite">{item.businessName || "—"}</td>
                    <td className="max-w-48 truncate px-4 py-3">
                      <a href={`mailto:${item.email}`} className="text-graphite hover:text-brand-deep">
                        {item.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={telHref(item.phone)} className="text-graphite hover:text-brand-deep">
                        {item.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-graphite">{item.service}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-steel">{formatDateTime(item.createdAt)}</td>
                    <td className="px-4 py-3">{statusSelect(item)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline-dark" className="h-8 px-3 text-[0.68rem]" onClick={() => openDetail(item)}>
                        <Eye className="size-3.5" aria-hidden="true" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <ul className="space-y-3 lg:hidden">
            {visible.map((item) => (
              <li key={item.id} className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{item.name}</p>
                    <p className="truncate text-xs text-steel">{item.businessName || "No business name"}</p>
                  </div>
                  <Badge tone={STATUS_TONES[item.status]}>{STATUS_LABELS[item.status]}</Badge>
                </div>
                <p className="mt-2 text-sm text-graphite">{item.service}</p>
                <p className="text-xs text-steel">{formatDateTime(item.createdAt)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {statusSelect(item)}
                  <a href={telHref(item.phone)} className="inline-flex size-8 items-center justify-center rounded-[3px] border border-ink/10" aria-label={`Call ${item.name}`}>
                    <Phone className="size-4" aria-hidden="true" />
                  </a>
                  <a href={`mailto:${item.email}`} className="inline-flex size-8 items-center justify-center rounded-[3px] border border-ink/10" aria-label={`Email ${item.name}`}>
                    <Mail className="size-4" aria-hidden="true" />
                  </a>
                  <Button variant="outline-dark" className="ml-auto h-8 px-3 text-[0.68rem]" onClick={() => openDetail(item)}>
                    View details
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <Modal
        open={selected !== null}
        onClose={() => !saving && closeDetail()}
        title={selected ? selected.name : "Inquiry"}
        description={selected ? `Received ${formatDateTime(selected.createdAt)}` : undefined}
        size="lg"
        footer={
          selected ? (
            <>
              <Button variant="outline-dark" className="sm:mr-auto" onClick={() => setPendingDelete(selected)} disabled={saving}>
                <Trash2 className="size-4" aria-hidden="true" /> Delete
              </Button>
              <Button variant="outline-dark" onClick={closeDetail} disabled={saving}>
                Close
              </Button>
              <Button onClick={() => void saveDetail()} disabled={saving || (edit.status === selected.status && edit.adminNotes === selected.adminNotes)}>
                {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
                Save Changes
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={telHref(selected.phone)} className="flex items-center gap-3 rounded-[4px] border border-ink/10 p-3 hover:border-ink/30">
                <Phone className="size-4 text-brand-deep" aria-hidden="true" />
                <span className="text-sm font-semibold">{selected.phone}</span>
              </a>
              <a href={`mailto:${selected.email}`} className="flex items-center gap-3 rounded-[4px] border border-ink/10 p-3 hover:border-ink/30">
                <Mail className="size-4 text-brand-deep" aria-hidden="true" />
                <span className="truncate text-sm font-semibold">{selected.email}</span>
              </a>
              <div className="flex items-center gap-3 rounded-[4px] border border-ink/10 p-3">
                <Building2 className="size-4 text-steel" aria-hidden="true" />
                <span className="text-sm">{selected.businessName || "No business name"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-[4px] border border-ink/10 p-3">
                <MapPin className="size-4 text-steel" aria-hidden="true" />
                <span className="text-sm">{selected.location || "No location given"}</span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-bold tracking-wide text-steel uppercase">Service needed</dt>
                <dd className="mt-0.5 font-semibold">{selected.service}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-wide text-steel uppercase">Preferred contact</dt>
                <dd className="mt-0.5 font-semibold">{selected.preferredContact}</dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-bold tracking-wide text-steel uppercase">Project details</p>
              <p className="mt-2 rounded-[4px] bg-fog p-4 text-sm leading-6 whitespace-pre-wrap text-ink">{selected.message}</p>
            </div>

            <div>
              <p className="text-xs font-bold tracking-wide text-steel uppercase">Attachments ({selected.attachments.length})</p>
              {selected.attachments.length === 0 ? (
                <p className="mt-2 text-sm text-steel">No files were attached.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {selected.attachments.map((file) => (
                    <li key={file.attachmentId} className="flex items-center gap-3 rounded-[4px] border border-ink/10 px-3 py-2">
                      {file.mimeType === "application/pdf" ? <FileText className="size-5 text-steel" aria-hidden="true" /> : <ImageIcon className="size-5 text-steel" aria-hidden="true" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{file.name}</p>
                        <p className="text-xs text-steel">{formatBytes(file.size)}</p>
                      </div>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex size-8 items-center justify-center rounded-[3px] border border-ink/10 hover:bg-fog" aria-label={`View ${file.name}`}>
                        <Eye className="size-4" aria-hidden="true" />
                      </a>
                      <a href={`${file.url}?download=1`} className="inline-flex size-8 items-center justify-center rounded-[3px] border border-ink/10 hover:bg-fog" aria-label={`Download ${file.name}`}>
                        <Download className="size-4" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid gap-4 border-t border-ink/10 pt-5 sm:grid-cols-3">
              <Field label="Status">
                {(p) => (
                  <select {...p} className={adminInput} value={edit.status} onChange={(e) => setEdit((c) => ({ ...c, status: e.target.value as QuoteStatus }))}>
                    {QUOTE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Admin notes" className="sm:col-span-2" help="Private. Never shown to the customer.">
                {(p) => <textarea {...p} rows={4} className={adminInput} value={edit.adminNotes} onChange={(e) => setEdit((c) => ({ ...c, adminNotes: e.target.value }))} placeholder="Follow-up notes, quote amount, next steps…" />}
              </Field>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete quote request?"
        message={`The request from ${pendingDelete?.name ?? ""} and any attached files will be permanently deleted.`}
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

