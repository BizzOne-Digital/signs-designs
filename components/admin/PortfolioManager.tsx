"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useApiData } from "@/lib/use-api-data";
import { Eye, EyeOff, LoaderCircle, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { GalleryField } from "@/components/admin/GalleryField";
import { AdminPageHeader, Badge, EmptyState, Field, IconButton, Spinner, Toggle, adminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiRequest, ApiError, errorMessage } from "@/lib/admin-client";
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from "@/lib/constants";
import { normalizeImageUrl } from "@/lib/images";
import type { PortfolioDTO } from "@/lib/types";

type Draft = Omit<PortfolioDTO, "id" | "createdAt" | "updatedAt"> & { id?: string };

const EMPTY: Draft = {
  title: "",
  slug: "",
  category: PORTFOLIO_CATEGORIES[0],
  description: "",
  location: "",
  image: "",
  galleryImages: [],
  featured: false,
  sortOrder: 0,
  published: true,
};

export function PortfolioManager() {
  const toast = useToast();
  const { data: items, setData: setItems, error: loadError, reload: load } = useApiData<PortfolioDTO[]>("/api/admin/portfolio");
  const [filter, setFilter] = useState<string>("All");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PortfolioDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = useMemo(() => (items ?? []).filter((p) => filter === "All" || p.category === filter), [items, filter]);

  const openNew = () => {
    setDraft({ ...EMPTY, sortOrder: (items?.length ?? 0) + 1 });
    setErrors({});
    setFormError("");
  };

  const openEdit = (item: PortfolioDTO) => {
    setDraft({ ...item, galleryImages: [...item.galleryImages] });
    setErrors({});
    setFormError("");
  };

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    if (errors[key as string]) setErrors((current) => ({ ...current, [key as string]: "" }));
  };

  const save = async () => {
    if (!draft) return;
    const clientErrors: Record<string, string> = {};
    if (draft.title.trim().length < 2) clientErrors.title = "Enter a project title.";
    if (!draft.image) clientErrors.image = "Upload a main image.";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    setFormError("");
    const { id, ...body } = draft;
    try {
      const saved = await apiRequest<PortfolioDTO>(id ? `/api/admin/portfolio/${id}` : "/api/admin/portfolio", { method: id ? "PUT" : "POST", body });
      setItems((current) => {
        const list = current ?? [];
        return id ? list.map((p) => (p.id === id ? saved : p)) : [...list, saved];
      });
      toast.success(id ? "Project updated." : "Project added.");
      setDraft(null);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) setErrors(error.fieldErrors);
      setFormError(errorMessage(error, "Could not save the project."));
    } finally {
      setSaving(false);
    }
  };

  const quickToggle = async (item: PortfolioDTO, key: "featured" | "published") => {
    setBusyId(item.id);
    try {
      const saved = await apiRequest<PortfolioDTO>(`/api/admin/portfolio/${item.id}`, { method: "PATCH", body: { [key]: !item[key] } });
      setItems((current) => (current ?? []).map((p) => (p.id === item.id ? saved : p)));
      toast.success(key === "featured" ? (saved.featured ? "Marked as featured." : "Removed from featured.") : saved.published ? "Project published." : "Project hidden.");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/admin/portfolio/${pendingDelete.id}`, { method: "DELETE" });
      setItems((current) => (current ?? []).filter((p) => p.id !== pendingDelete.id));
      toast.success("Project deleted.");
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
        title="Portfolio"
        description="Add real project photos to replace the placeholders. Featured projects appear on the homepage."
        actions={
          <Button onClick={openNew} icon={<Plus className="size-4" aria-hidden="true" />}>
            Add Project
          </Button>
        }
      />

      <div role="group" aria-label="Filter by category" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {["All", ...PORTFOLIO_CATEGORIES].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
            className={`shrink-0 rounded-[3px] border px-3 py-1.5 text-xs font-bold uppercase transition ${filter === category ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-graphite hover:border-ink/40"}`}
          >
            {category}
          </button>
        ))}
      </div>

      {loadError ? (
        <EmptyState title="Could not load projects" text={loadError} action={<Button onClick={() => void load()}>Retry</Button>} />
      ) : items === null ? (
        <Spinner label="Loading projects" />
      ) : visible.length === 0 ? (
        <EmptyState title="No projects yet" text="Add your first project with photos from a recent job." action={<Button onClick={openNew}>Add Project</Button>} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card">
              <div className="relative aspect-[16/10] bg-fog">
                <Image src={normalizeImageUrl(item.image)} alt="" fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw" className={`object-cover ${item.published ? "" : "opacity-50 grayscale"}`} />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                  {item.featured ? <Badge tone="red">Featured</Badge> : null}
                  {!item.published ? <Badge tone="gray">Hidden</Badge> : null}
                </div>
              </div>
              <div className="p-4">
                <p className="text-[0.7rem] font-bold tracking-wide text-brand-deep uppercase">{item.category}</p>
                <h2 className="mt-0.5 truncate font-display font-extrabold">{item.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-xs text-steel">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {item.location || "No location"} · Order {item.sortOrder} · {item.galleryImages.length} gallery
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline-dark" className="h-9 flex-1 px-3 text-[0.7rem]" onClick={() => openEdit(item)} icon={<Pencil className="size-3.5" aria-hidden="true" />}>
                    Edit
                  </Button>
                  <IconButton label={item.featured ? "Remove from featured" : "Mark as featured"} onClick={() => void quickToggle(item, "featured")} disabled={busyId === item.id}>
                    <Star className={`size-4 ${item.featured ? "fill-brand text-brand" : ""}`} aria-hidden="true" />
                  </IconButton>
                  <IconButton label={item.published ? "Unpublish" : "Publish"} onClick={() => void quickToggle(item, "published")} disabled={busyId === item.id}>
                    {item.published ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
                  </IconButton>
                  <IconButton label="Delete project" tone="danger" onClick={() => setPendingDelete(item)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </IconButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={draft !== null}
        onClose={() => !saving && setDraft(null)}
        title={draft?.id ? "Edit Project" : "Add Project"}
        size="xl"
        footer={
          <>
            <Button variant="outline-dark" onClick={() => setDraft(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={() => void save()} disabled={saving}>
              {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
              {saving ? "Saving…" : "Save Project"}
            </Button>
          </>
        }
      >
        {draft ? (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <Field label="Project title" required error={errors.title}>
                {(p) => <input {...p} className={adminInput} value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Illuminated storefront sign" />}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category" required error={errors.category}>
                  {(p) => (
                    <select {...p} className={adminInput} value={draft.category} onChange={(e) => set("category", e.target.value as PortfolioCategory)}>
                      {PORTFOLIO_CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field label="Location" error={errors.location}>
                  {(p) => <input {...p} className={adminInput} value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Windsor, ON" />}
                </Field>
              </div>
              <Field label="Description" error={errors.description} help="One or two sentences about the project.">
                {(p) => <textarea {...p} rows={4} className={adminInput} value={draft.description} onChange={(e) => set("description", e.target.value)} />}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sort order" error={errors.sortOrder} help="Lower numbers appear first.">
                  {(p) => <input {...p} type="number" className={adminInput} value={draft.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />}
                </Field>
                <Field label="URL slug" error={errors.slug} help="Leave blank to generate from the title.">
                  {(p) => <input {...p} className={adminInput} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />}
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Toggle label="Featured" description="Show on the homepage" checked={draft.featured} onChange={(v) => set("featured", v)} />
                <Toggle label="Published" description="Visible on the website" checked={draft.published} onChange={(v) => set("published", v)} />
              </div>
            </div>
            <div className="space-y-5 lg:col-span-2">
              <div>
                <LocalImageField label="Main image" required folder="gallery" value={draft.image} onChange={(url) => set("image", url)} aspect="aspect-[4/3]" />
                {errors.image ? <p className="mt-1.5 text-xs font-medium text-brand-deep">{errors.image}</p> : null}
              </div>
            </div>
            <div className="lg:col-span-5">
              <GalleryField folder="gallery" value={draft.galleryImages} onChange={(urls) => set("galleryImages", urls)} />
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
        title="Delete project?"
        message={`"${pendingDelete?.title ?? ""}" and its uploaded images will be permanently removed.`}
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
