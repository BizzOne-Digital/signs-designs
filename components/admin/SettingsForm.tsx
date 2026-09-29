"use client";

import { useState } from "react";
import { useApiData } from "@/lib/use-api-data";
import { LoaderCircle, Save } from "lucide-react";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { AdminCard, AdminPageHeader, EmptyState, Field, Spinner, adminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { apiRequest, ApiError, errorMessage } from "@/lib/admin-client";
import type { SiteSettingsDTO } from "@/lib/types";

export function SettingsForm() {
  const toast = useToast();
  const { data: saved, setData: setSaved, error: loadError, reload: load } = useApiData<SiteSettingsDTO>("/api/admin/settings");
  const [draft, setDraft] = useState<SiteSettingsDTO | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const values = draft ?? saved;

  const set = (key: keyof SiteSettingsDTO, value: string) => {
    if (values) setDraft({ ...values, [key]: value });
    if (errors[key]) setErrors((current) => ({ ...current, [key]: "" }));
  };

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values) return;
    const clientErrors: Record<string, string> = {};
    if (values.businessName.trim().length < 2) clientErrors.businessName = "Enter the business name.";
    if (values.phone.replace(/\D/g, "").length < 10) clientErrors.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) clientErrors.email = "Enter a valid email address.";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    try {
      const data = await apiRequest<SiteSettingsDTO>("/api/admin/settings", { method: "PUT", body: values });
      setSaved(data);
      setDraft(null);
      toast.success("Settings saved.");
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) setErrors(error.fieldErrors);
      toast.error(errorMessage(error, "Could not save settings."));
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <EmptyState title="Could not load settings" text={loadError} action={<Button onClick={() => void load()}>Retry</Button>} />;
  if (!values) return <Spinner label="Loading settings" />;

  const text = (key: keyof SiteSettingsDTO, label: string, options: { required?: boolean; help?: string; type?: string; textarea?: boolean } = {}) => (
    <Field label={label} required={options.required} help={options.help} error={errors[key]}>
      {(p) =>
        options.textarea ? (
          <textarea {...p} rows={3} className={adminInput} value={values[key]} onChange={(e) => set(key, e.target.value)} />
        ) : (
          <input {...p} type={options.type ?? "text"} className={adminInput} value={values[key]} onChange={(e) => set(key, e.target.value)} />
        )
      }
    </Field>
  );

  return (
    <form onSubmit={save} noValidate>
      <AdminPageHeader
        title="Settings"
        description="Business details used across the website header, footer, contact page and search results."
        actions={
          <Button type="submit" disabled={saving || !dirty}>
            {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard className="space-y-4 p-5 sm:p-6 lg:col-span-2">
          <h2 className="font-display text-sm font-extrabold tracking-[0.1em]">Business details</h2>
          {text("businessName", "Business name", { required: true })}
          <div className="grid gap-4 sm:grid-cols-2">
            {text("phone", "Phone", { required: true, type: "tel" })}
            {text("email", "Email", { required: true, type: "email", help: "Shown publicly on the website." })}
          </div>
          {text("address", "Address")}
          {text("facebook", "Facebook page URL", { type: "url" })}
          <h2 className="pt-4 font-display text-sm font-extrabold tracking-[0.1em]">Search engine (SEO)</h2>
          {text("seoTitle", "Homepage SEO title", { help: `${values.seoTitle.length}/60 characters recommended` })}
          {text("seoDescription", "Homepage meta description", { textarea: true, help: `${values.seoDescription.length}/160 characters recommended` })}
        </AdminCard>
        <AdminCard className="space-y-5 p-5 sm:p-6">
          <h2 className="font-display text-sm font-extrabold tracking-[0.1em]">Branding</h2>
          <LocalImageField
            label="Logo"
            folder="misc"
            value={values.logo}
            onChange={(url) => set("logo", url)}
            aspect="aspect-[3/1]"
            help="Optional. Use a PNG or WEBP with a transparent background, designed for dark backgrounds. Leave empty to use the built-in logo."
          />
          <LocalImageField
            label="Favicon"
            folder="misc"
            value={values.favicon}
            onChange={(url) => set("favicon", url)}
            aspect="aspect-square"
            help="Optional. Square PNG, at least 64 × 64 px."
          />
        </AdminCard>
      </div>
    </form>
  );
}
