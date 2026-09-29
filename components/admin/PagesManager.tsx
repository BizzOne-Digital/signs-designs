"use client";

import Link from "next/link";
import { useState } from "react";
import { useApiData } from "@/lib/use-api-data";
import { ExternalLink, LoaderCircle, RotateCcw, Save } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { ListEditor } from "@/components/admin/ListEditor";
import { AdminCard, AdminPageHeader, EmptyState, Field, Spinner, adminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiRequest, errorMessage } from "@/lib/admin-client";
import { PAGE_CONTENT, PAGE_KEYS, type ContentField, type ContentSection, type PageKey } from "@/lib/content-definitions";
import type { PageContentValues } from "@/lib/types";

export function PagesManager() {
  const toast = useToast();
  const [page, setPage] = useState<PageKey>("home");
  const { data, setData, error: loadError, reload } = useApiData<{ page: PageKey; values: PageContentValues }>(`/api/admin/pages?page=${page}`);
  const [draft, setDraft] = useState<{ page: PageKey; values: PageContentValues } | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingPage, setPendingPage] = useState<PageKey | null>(null);

  const saved = data?.values ?? null;
  const values = draft?.page === page ? draft.values : saved;
  const dirty = values !== null && saved !== null && JSON.stringify(values) !== JSON.stringify(saved);

  const switchPage = (target: PageKey) => {
    if (target === page) return;
    if (dirty) setPendingPage(target);
    else {
      setDraft(null);
      setPage(target);
    }
  };

  const setValues = (next: PageContentValues | null) => setDraft(next ? { page, values: next } : null);
  const setValue = (path: string, value: string | string[]) => {
    if (values) setDraft({ page, values: { ...values, [path]: value } });
  };

  const save = async () => {
    if (!values || !saved) return;
    const changed = Object.fromEntries(Object.entries(values).filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(saved[key])));
    if (Object.keys(changed).length === 0) return;
    setSaving(true);
    try {
      const result = await apiRequest<{ values: PageContentValues }>("/api/admin/pages", { method: "PUT", body: { page, values: changed } });
      setData({ page, values: result.values });
      setDraft(null);
      toast.success(`${PAGE_CONTENT[page].label} page updated.`);
    } catch (error) {
      toast.error(errorMessage(error, "Could not save changes."));
    } finally {
      setSaving(false);
    }
  };

  const renderField = (section: ContentSection, field: ContentField) => {
    const path = `${section.id}.${field.key}`;
    const value = values?.[path] ?? field.default;

    if (field.type === "image") {
      return (
        <LocalImageField
          key={path}
          label={field.label}
          folder="pages"
          value={typeof value === "string" ? value : ""}
          onChange={(url) => setValue(path, url)}
          help="Removing an image restores the default placeholder."
        />
      );
    }
    if (field.type === "json") {
      return <ListEditor key={path} label={field.label} value={Array.isArray(value) ? value : []} onChange={(list) => setValue(path, list)} help={field.help} max={8} />;
    }
    return (
      <Field key={path} label={field.label} help={field.help}>
        {(p) =>
          field.type === "textarea" ? (
            <textarea {...p} rows={4} className={adminInput} value={String(value)} onChange={(e) => setValue(path, e.target.value)} />
          ) : (
            <input {...p} className={adminInput} value={String(value)} onChange={(e) => setValue(path, e.target.value)} />
          )
        }
      </Field>
    );
  };

  const definition = PAGE_CONTENT[page];

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Edit headlines, copy and images on key website pages. Changes go live when you save."
        actions={
          <Link href={definition.path} target="_blank" className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-ink/15 bg-white px-4 text-xs font-bold tracking-wide text-ink uppercase hover:bg-fog">
            <ExternalLink className="size-4" aria-hidden="true" /> View page
          </Link>
        }
      />

      <div role="tablist" aria-label="Pages" className="-mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-ink/10 px-4 sm:mx-0 sm:px-0">
        {PAGE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={page === key}
            onClick={() => switchPage(key)}
            className={`-mb-px shrink-0 border-b-[3px] px-4 py-3 text-sm font-bold uppercase transition ${page === key ? "border-brand text-ink" : "border-transparent text-steel hover:text-ink"}`}
          >
            {PAGE_CONTENT[key].label}
          </button>
        ))}
      </div>

      {loadError ? (
        <EmptyState title="Could not load content" text={loadError} action={<Button onClick={reload}>Retry</Button>} />
      ) : values === null ? (
        <Spinner label="Loading content" />
      ) : (
        <div className="space-y-5 pb-24" role="tabpanel">
          {(definition.sections as ContentSection[]).map((section) => {
            const images = section.fields.filter((f) => f.type === "image");
            const others = section.fields.filter((f) => f.type !== "image");
            return (
              <AdminCard key={section.id} className="p-5 sm:p-6">
                <h2 className="mb-5 font-display text-sm font-extrabold tracking-[0.1em]">{section.label}</h2>
                <div className={`grid gap-6 ${images.length ? "lg:grid-cols-3" : ""}`}>
                  <div className={`space-y-4 ${images.length ? "lg:col-span-2" : ""}`}>{others.map((field) => renderField(section, field))}</div>
                  {images.length ? <div className="space-y-4">{images.map((field) => renderField(section, field))}</div> : null}
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {values ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-2 lg:px-6">
            <p className={`text-sm font-medium ${dirty ? "text-brand-deep" : "text-steel"}`}>{dirty ? "You have unsaved changes" : "All changes saved"}</p>
            <div className="flex gap-2">
              <Button variant="outline-dark" onClick={() => setValues(null)} disabled={!dirty || saving} icon={undefined}>
                <RotateCcw className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Discard</span>
              </Button>
              <Button onClick={() => void save()} disabled={!dirty || saving}>
                {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingPage !== null}
        title="Discard unsaved changes?"
        message="You have unsaved edits on this page. Switching pages will discard them."
        confirmLabel="Discard changes"
        onConfirm={() => {
          if (pendingPage) {
            setDraft(null);
            setPage(pendingPage);
          }
          setPendingPage(null);
        }}
        onCancel={() => setPendingPage(null)}
      />
    </>
  );
}
