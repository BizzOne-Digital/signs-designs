"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useApiData } from "@/lib/use-api-data";
import { ExternalLink, LoaderCircle, Pencil, Plus, Search, Send, Star, Trash2, Undo2 } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { AdminPageHeader, Badge, EmptyState, Field, IconButton, Spinner, Toggle, adminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiRequest, ApiError, errorMessage } from "@/lib/admin-client";
import { BLOG_CATEGORIES, type BlogStatus } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/images";
import type { BlogPostDTO } from "@/lib/types";

type Draft = Omit<BlogPostDTO, "id" | "createdAt" | "updatedAt"> & { id?: string };

const EMPTY: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: BLOG_CATEGORIES[0],
  author: "Eric Marmus",
  status: "draft",
  featured: false,
  publishedAt: null,
};

const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

export function BlogManager() {
  const toast = useToast();
  const { data: items, setData: setItems, error: loadError, reload: load } = useApiData<BlogPostDTO[]>("/api/admin/blog");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState<false | BlogStatus>(false);
  const [pendingDelete, setPendingDelete] = useState<BlogPostDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? []).filter((p) => (statusFilter === "all" || p.status === statusFilter) && (!q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
  }, [items, statusFilter, query]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    if (errors[key as string]) setErrors((current) => ({ ...current, [key as string]: "" }));
  };

  const upsertLocal = (saved: BlogPostDTO) =>
    setItems((current) => {
      const list = current ?? [];
      return list.some((p) => p.id === saved.id) ? list.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...list];
    });

  const save = async (status: BlogStatus) => {
    if (!draft) return;
    const clientErrors: Record<string, string> = {};
    if (draft.title.trim().length < 3) clientErrors.title = "Enter a title (at least 3 characters).";
    if (status === "published") {
      if (!draft.excerpt.trim()) clientErrors.excerpt = "Add a short excerpt before publishing.";
      if (draft.content.trim().length < 50) clientErrors.content = "Write the article content before publishing.";
    }
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSaving(status);
    setFormError("");
    const { id, ...rest } = draft;
    const body = { ...rest, status, publishedAt: rest.publishedAt ? new Date(rest.publishedAt).toISOString() : null };
    try {
      const saved = await apiRequest<BlogPostDTO>(id ? `/api/admin/blog/${id}` : "/api/admin/blog", { method: id ? "PUT" : "POST", body });
      upsertLocal(saved);
      toast.success(status === "published" ? "Post published." : "Draft saved.");
      setDraft(null);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) setErrors(error.fieldErrors);
      setFormError(errorMessage(error, "Could not save the post."));
    } finally {
      setSaving(false);
    }
  };

  const patch = async (item: BlogPostDTO, changes: Partial<Pick<BlogPostDTO, "status" | "featured">>, message: string) => {
    setBusyId(item.id);
    try {
      upsertLocal(await apiRequest<BlogPostDTO>(`/api/admin/blog/${item.id}`, { method: "PATCH", body: changes }));
      toast.success(message);
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
      await apiRequest(`/api/admin/blog/${pendingDelete.id}`, { method: "DELETE" });
      setItems((current) => (current ?? []).filter((p) => p.id !== pendingDelete.id));
      toast.success("Post deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const counts = {
    all: items?.length ?? 0,
    published: items?.filter((p) => p.status === "published").length ?? 0,
    draft: items?.filter((p) => p.status === "draft").length ?? 0,
  };

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Write articles, save drafts, and publish when ready."
        actions={
          <Button
            onClick={() => {
              setDraft({ ...EMPTY });
              setErrors({});
              setFormError("");
            }}
            icon={<Plus className="size-4" aria-hidden="true" />}
          >
            New Post
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by status" className="flex gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={`rounded-[3px] border px-3 py-1.5 text-xs font-bold uppercase transition ${statusFilter === status ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-graphite hover:border-ink/40"}`}
            >
              {status} ({counts[status]})
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts" aria-label="Search posts" className={`${adminInput} pl-9`} />
        </div>
      </div>

      {loadError ? (
        <EmptyState title="Could not load posts" text={loadError} action={<Button onClick={() => void load()}>Retry</Button>} />
      ) : items === null ? (
        <Spinner label="Loading posts" />
      ) : visible.length === 0 ? (
        <EmptyState title="No posts found" text="Create a new post or change the filter." />
      ) : (
        <ul className="space-y-3">
          {visible.map((post) => (
            <li key={post.id} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-ink/10 bg-white p-4 shadow-card sm:flex-row sm:items-center">
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[4px] bg-fog sm:w-32">
                <Image src={normalizeImageUrl(post.featuredImage)} alt="" fill sizes="128px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={post.status === "published" ? "green" : "amber"}>{post.status}</Badge>
                  {post.featured ? <Badge tone="red">Featured</Badge> : null}
                  <span className="text-xs text-steel">{post.category}</span>
                </div>
                <h2 className="mt-1.5 truncate font-display font-extrabold">{post.title}</h2>
                <p className="mt-0.5 text-xs text-steel">
                  {post.status === "published" && post.publishedAt ? `Published ${formatDate(post.publishedAt)}` : `Updated ${formatDate(post.updatedAt)}`} · {post.author}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {post.status === "published" ? (
                  <>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="inline-flex size-9 items-center justify-center rounded-[4px] border border-ink/10 text-graphite hover:bg-fog" aria-label="View post" title="View post">
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </Link>
                    <IconButton label="Unpublish (move to drafts)" onClick={() => void patch(post, { status: "draft" }, "Post moved to drafts.")} disabled={busyId === post.id}>
                      <Undo2 className="size-4" aria-hidden="true" />
                    </IconButton>
                  </>
                ) : (
                  <IconButton label="Publish" onClick={() => void patch(post, { status: "published" }, "Post published.")} disabled={busyId === post.id}>
                    <Send className="size-4" aria-hidden="true" />
                  </IconButton>
                )}
                <IconButton label={post.featured ? "Remove featured" : "Feature on blog page"} onClick={() => void patch(post, { featured: !post.featured }, post.featured ? "Removed from featured." : "Featured on the blog page.")} disabled={busyId === post.id}>
                  <Star className={`size-4 ${post.featured ? "fill-brand text-brand" : ""}`} aria-hidden="true" />
                </IconButton>
                <Button
                  variant="outline-dark"
                  className="h-9 px-3 text-[0.7rem]"
                  onClick={() => {
                    setDraft({ ...post });
                    setErrors({});
                    setFormError("");
                  }}
                  icon={<Pencil className="size-3.5" aria-hidden="true" />}
                >
                  Edit
                </Button>
                <IconButton label="Delete post" tone="danger" onClick={() => setPendingDelete(post)}>
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
        title={draft?.id ? "Edit Post" : "New Post"}
        size="xl"
        footer={
          <>
            <Button variant="outline-dark" onClick={() => setDraft(null)} disabled={!!saving}>
              Cancel
            </Button>
            <Button variant="outline-dark" onClick={() => void save("draft")} disabled={!!saving}>
              {saving === "draft" ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
              {draft?.status === "published" ? "Unpublish & Save Draft" : "Save Draft"}
            </Button>
            <Button onClick={() => void save("published")} disabled={!!saving}>
              {saving === "published" ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
              {draft?.status === "published" ? "Update Post" : "Publish"}
            </Button>
          </>
        }
      >
        {draft ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Field label="Title" required error={errors.title}>
                {(p) => <input {...p} className={`${adminInput} text-base font-semibold`} value={draft.title} onChange={(e) => set("title", e.target.value)} />}
              </Field>
              <Field label="Excerpt" error={errors.excerpt} help="Shown on blog cards and in search results (1–2 sentences).">
                {(p) => <textarea {...p} rows={3} className={adminInput} value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value)} />}
              </Field>
              <Field label="Article content" error={errors.content} help="Use the toolbar for headings, lists, bold text and links.">
                {(p) => <MarkdownEditor id={p.id} value={draft.content} onChange={(v) => set("content", v)} invalid={!!errors.content} />}
              </Field>
            </div>
            <div className="space-y-4">
              <LocalImageField label="Featured image" folder="pages" value={draft.featuredImage} onChange={(url) => set("featuredImage", url)} />
              <Field label="Category" required error={errors.category}>
                {(p) => (
                  <>
                    <input {...p} list="blog-categories" className={adminInput} value={draft.category} onChange={(e) => set("category", e.target.value)} />
                    <datalist id="blog-categories">
                      {BLOG_CATEGORIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </>
                )}
              </Field>
              <Field label="Author" error={errors.author}>
                {(p) => <input {...p} className={adminInput} value={draft.author} onChange={(e) => set("author", e.target.value)} />}
              </Field>
              <Field label="Publish date" error={errors.publishedAt} help="Optional. Defaults to the day it is first published.">
                {(p) => <input {...p} type="date" className={adminInput} value={toDateInput(draft.publishedAt)} onChange={(e) => set("publishedAt", e.target.value ? `${e.target.value}T12:00:00.000Z` : null)} />}
              </Field>
              <Field label="URL slug" error={errors.slug} help="Leave blank to generate from the title.">
                {(p) => <input {...p} className={adminInput} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />}
              </Field>
              <Toggle label="Featured" description="Highlight at the top of the blog page" checked={draft.featured} onChange={(v) => set("featured", v)} />
            </div>
            {formError ? (
              <p role="alert" className="rounded-[4px] border border-brand/30 bg-brand/5 px-3 py-2.5 text-sm font-medium text-brand-deep lg:col-span-3">
                {formError}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete post?"
        message={`"${pendingDelete?.title ?? ""}" will be permanently deleted. To hide it instead, move it to drafts.`}
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
