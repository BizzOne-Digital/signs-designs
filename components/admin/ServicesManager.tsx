"use client";

import Image from "next/image";
import { useState } from "react";
import { useApiData } from "@/lib/use-api-data";
import { ArrowDown, ArrowUp, LoaderCircle, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { ListEditor } from "@/components/admin/ListEditor";
import { AdminPageHeader, Badge, EmptyState, Field, IconButton, Spinner, Toggle, adminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { ServiceIcon, SERVICE_ICON_LABELS } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { apiRequest, ApiError, errorMessage } from "@/lib/admin-client";
import { SERVICE_ICONS, type ServiceIconKey } from "@/lib/constants";
import { normalizeImageUrl } from "@/lib/images";
import type { ServiceDTO } from "@/lib/types";

type Draft = Omit<ServiceDTO, "id" | "updatedAt"> & { id?: string };

const EMPTY: Draft = { title: "", slug: "", shortDescription: "", description: "", image: "", icon: "store", features: [], sortOrder: 0, active: true };

export function ServicesManager() {
  const toast = useToast();
  const { data: items, setData: setItems, error: loadError, reload: load } = useApiData<ServiceDTO[]>("/api/admin/services");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ServiceDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    if (errors[key as string]) setErrors((current) => ({ ...current, [key as string]: "" }));
  };

  const save = async () => {
    if (!draft) return;
    const clientErrors: Record<string, string> = {};
    if (draft.title.trim().length < 2) clientErrors.title = "Enter a service title.";
    if (draft.shortDescription.trim().length < 10) clientErrors.shortDescription = "Short description must be at least 10 characters.";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    setFormError("");
    const { id, ...body } = draft;
    try {
      const saved = await apiRequest<ServiceDTO>(id ? `/api/admin/services/${id}` : "/api/admin/services", { method: id ? "PUT" : "POST", body });
      setItems((current) => {
        const list = current ?? [];
        const next = id ? list.map((s) => (s.id === id ? saved : s)) : [...list, saved];
        return next.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      toast.success(id ? "Service updated." : "Service added.");
      setDraft(null);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) setErrors(error.fieldErrors);
      setFormError(errorMessage(error, "Could not save the service."));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: ServiceDTO) => {
    setBusy(true);
    try {
      const saved = await apiRequest<ServiceDTO>(`/api/admin/services/${item.id}`, { method: "PATCH", body: { active: !item.active } });
      setItems((current) => (current ?? []).map((s) => (s.id === item.id ? saved : s)));
      toast.success(saved.active ? "Service is now active." : "Service hidden from the website.");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  /** Swaps display order with the neighbouring service and persists both. */
  const move = async (index: number, direction: -1 | 1) => {
    if (!items) return;
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const withOrder = reordered.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    setItems(withOrder);
    setBusy(true);
    try {
      const original = new Map(items.map((s) => [s.id, s.sortOrder]));
      await Promise.all(
        withOrder
          .filter((s) => original.get(s.id) !== s.sortOrder)
          .map((s) => apiRequest(`/api/admin/services/${s.id}`, { method: "PATCH", body: { sortOrder: s.sortOrder } })),
      );
      toast.success("Display order saved.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not save the new order."));
      void load();
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/admin/services/${pendingDelete.id}`, { method: "DELETE" });
      setItems((current) => (current ?? []).filter((s) => s.id !== pendingDelete.id));
      toast.success("Service deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Edit the services shown on the homepage and Services page. Use the arrows to change display order."
        actions={
          <Button
            onClick={() => {
              setDraft({ ...EMPTY, sortOrder: (items?.length ?? 0) + 1 });
              setErrors({});
              setFormError("");
            }}
            icon={<Plus className="size-4" aria-hidden="true" />}
          >
            Add Service
          </Button>
        }
      />

      {loadError ? (
        <EmptyState title="Could not load services" text={loadError} action={<Button onClick={() => void load()}>Retry</Button>} />
      ) : items === null ? (
        <Spinner label="Loading services" />
      ) : items.length === 0 ? (
        <EmptyState title="No services yet" />
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id} className={`flex flex-col gap-4 rounded-[var(--radius-card)] border bg-white p-4 shadow-card sm:flex-row sm:items-center ${item.active ? "border-ink/10" : "border-dashed border-ink/20 opacity-70"}`}>
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[4px] bg-fog sm:w-36">
                <Image src={normalizeImageUrl(item.image)} alt="" fill sizes="144px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-[3px] bg-brand text-white">
                    <ServiceIcon icon={item.icon} className="size-4" />
                  </span>
                  <h2 className="truncate font-display font-extrabold">{item.title}</h2>
                  {!item.active ? <Badge>Inactive</Badge> : null}
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-steel">{item.shortDescription}</p>
                <p className="mt-1 text-xs text-steel">{item.features.length} features · Order {item.sortOrder}</p>
              </div>
              <div className="flex items-center gap-2">
                <IconButton label="Move up" onClick={() => void move(index, -1)} disabled={busy || index === 0}>
                  <ArrowUp className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton label="Move down" onClick={() => void move(index, 1)} disabled={busy || index === items.length - 1}>
                  <ArrowDown className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton label={item.active ? "Deactivate" : "Activate"} onClick={() => void toggleActive(item)} disabled={busy}>
                  <Power className={`size-4 ${item.active ? "text-emerald-600" : ""}`} aria-hidden="true" />
                </IconButton>
                <Button
                  variant="outline-dark"
                  className="h-9 px-3 text-[0.7rem]"
                  onClick={() => {
                    setDraft({ ...item, features: [...item.features] });
                    setErrors({});
                    setFormError("");
                  }}
                  icon={<Pencil className="size-3.5" aria-hidden="true" />}
                >
                  Edit
                </Button>
                <IconButton label="Delete service" tone="danger" onClick={() => setPendingDelete(item)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={draft !== null}
        onClose={() => !saving && setDraft(null)}
        title={draft?.id ? "Edit Service" : "Add Service"}
        size="xl"
        footer={
          <>
            <Button variant="outline-dark" onClick={() => setDraft(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={() => void save()} disabled={saving}>
              {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
              {saving ? "Saving…" : "Save Service"}
            </Button>
          </>
        }
      >
        {draft ? (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <Field label="Service title" required error={errors.title}>
                {(p) => <input {...p} className={adminInput} value={draft.title} onChange={(e) => set("title", e.target.value)} />}
              </Field>
              <Field label="Short description" required error={errors.shortDescription} help="Shown on service cards (1–2 sentences).">
                {(p) => <textarea {...p} rows={3} className={adminInput} value={draft.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />}
              </Field>
              <Field label="Full description" error={errors.description} help="Shown on the Services page. Separate paragraphs with a blank line.">
                {(p) => <textarea {...p} rows={7} className={adminInput} value={draft.description} onChange={(e) => set("description", e.target.value)} />}
              </Field>
              <ListEditor label="Features" value={draft.features} onChange={(features) => set("features", features)} placeholder="e.g. Illuminated signage" />
            </div>
            <div className="space-y-4 lg:col-span-2">
              <LocalImageField label="Service image" folder="pages" value={draft.image} onChange={(url) => set("image", url)} aspect="aspect-[4/3]" />
              <div>
                <p id="service-icon-label" className="mb-1.5 text-xs font-bold tracking-[0.08em] text-graphite uppercase">
                  Icon
                </p>
                  <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-labelledby="service-icon-label">
                    {SERVICE_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        role="radio"
                        aria-checked={draft.icon === icon}
                        title={SERVICE_ICON_LABELS[icon]}
                        aria-label={SERVICE_ICON_LABELS[icon]}
                        onClick={() => set("icon", icon as ServiceIconKey)}
                        className={`flex aspect-square items-center justify-center rounded-[4px] border transition ${draft.icon === icon ? "border-brand bg-brand text-white" : "border-ink/15 text-graphite hover:border-ink/40"}`}
                      >
                        <ServiceIcon icon={icon} className="size-5" />
                      </button>
                    ))}
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Display order" error={errors.sortOrder}>
                  {(p) => <input {...p} type="number" className={adminInput} value={draft.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />}
                </Field>
                <Field label="Slug" error={errors.slug} help="Used for page anchors.">
                  {(p) => <input {...p} className={adminInput} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />}
                </Field>
              </div>
              <Toggle label="Active" description="Show this service on the website" checked={draft.active} onChange={(v) => set("active", v)} />
            </div>
            {formError ? (
              <p role="alert" className="rounded-[4px] border border-brand/30 bg-brand/5 px-3 py-2.5 text-sm font-medium text-brand-deep lg:col-span-5">
                {formError}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete service?"
        message={`"${pendingDelete?.title ?? ""}" will be removed from the website. To hide it temporarily, deactivate it instead.`}
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
