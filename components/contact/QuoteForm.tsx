"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronDown, CircleCheck, LoaderCircle } from "lucide-react";
import { AttachmentUploader, type UploadedAttachment } from "@/components/contact/AttachmentUploader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { PREFERRED_CONTACT_OPTIONS, QUOTE_SERVICE_OPTIONS } from "@/lib/constants";

type Fields = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  message: string;
  preferredContact: string;
  website: string;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  service: "",
  location: "",
  message: "",
  preferredContact: "Either",
  website: "",
};

const FIELD_ORDER: (keyof Fields)[] = ["name", "businessName", "phone", "email", "service", "location", "message"];

function validate(values: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) errors.phone = "Please enter a phone number.";
  else if (digits.length < 10 || digits.length > 15 || !/^[\d\s()+.-]+$/.test(values.phone)) errors.phone = "Enter a valid phone number, including area code.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.service) errors.service = "Choose the service you need.";
  if (values.message.trim().length < 10) errors.message = "Tell us a little about your project (at least 10 characters).";
  if (values.message.length > 5000) errors.message = "Please keep project details under 5000 characters.";
  if (values.businessName.length > 140) errors.businessName = "Business name is too long.";
  if (values.location.length > 160) errors.location = "Location is too long.";
  return errors;
}

const inputClass = (invalid: boolean) =>
  `block w-full rounded-[4px] border bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-steel/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition focus:outline-none focus:ring-2 ${
    invalid ? "border-brand-deep focus:border-brand-deep focus:ring-brand/20" : "border-ink/15 focus:border-ink focus:ring-ink/10"
  }`;

export function QuoteForm({ email }: { email: string }) {
  const searchParams = useSearchParams();
  const toast = useToast();
  const formId = useId();
  const [values, setValues] = useState<Fields>(() => {
    const requested = searchParams.get("service");
    return { ...EMPTY, service: requested && (QUOTE_SERVICE_OPTIONS as readonly string[]).includes(requested) ? requested : "" };
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, [uploaderKey]);

  const fieldId = (name: keyof Fields) => `${formId}-${name}`;

  const update = (name: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const first = FIELD_ORDER.find((name) => fieldErrors[name]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(clientErrors);
      toast.error("Please check the highlighted fields.");
      return;
    }
    if (uploading) {
      toast.info("Please wait for your files to finish uploading.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, attachments, startedAt: startedAt.current }),
      });
      const payload = (await response.json().catch(() => null)) as { success?: boolean; error?: string; fieldErrors?: FieldErrors } | null;

      if (!response.ok || !payload?.success) {
        if (payload?.fieldErrors) {
          setErrors(payload.fieldErrors);
          focusFirstError(payload.fieldErrors);
        }
        const message = payload?.error || "We couldn't send your request. Please try again or call us.";
        setFormError(message);
        toast.error(message);
        return;
      }

      setSubmitted(true);
      toast.success("Thanks! Your quote request has been sent.");
      window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120, behavior: "smooth" });
    } catch {
      const message = "Network error — please check your connection and try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setAttachments([]);
    setUploaderKey((k) => k + 1);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-8 text-center shadow-card sm:p-12" role="status">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="size-9" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">Quote Request Received</h2>
        <p className="mx-auto mt-4 max-w-md leading-7 text-graphite/85">
          Thank you, {values.name.split(" ")[0] || "and welcome"}. We&apos;ll review your project details and contact you by {values.preferredContact === "Either" ? "phone or email" : values.preferredContact.toLowerCase()} with a custom quote.
        </p>
        <Button variant="outline-dark" className="mt-8" onClick={reset}>
          Send Another Request
        </Button>
      </div>
    );
  }

  const errorText = (name: keyof Fields) =>
    errors[name] ? (
      <p id={`${fieldId(name)}-error`} className="mt-1.5 text-sm font-medium text-brand-deep">
        {errors[name]}
      </p>
    ) : null;

  const aria = (name: keyof Fields) => ({
    id: fieldId(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${fieldId(name)}-error` : undefined,
  });

  const label = (name: keyof Fields, text: string, required = false) => (
    <label htmlFor={fieldId(name)} className="mb-2 block font-display text-xs font-bold tracking-[0.12em] text-ink uppercase">
      {text}
      {required ? (
        <span className="ml-0.5 text-brand-deep" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="ml-1.5 font-sans text-[0.7rem] font-medium tracking-normal text-steel normal-case">(optional)</span>
      )}
    </label>
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 shadow-card sm:p-8 lg:p-10"
      aria-describedby={`${formId}-required-note`}
    >
      <div className="mb-8 flex flex-col gap-2 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-3 text-brand-deep">Project details</p>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Request a Free Quote</h2>
        </div>
        <p id={`${formId}-required-note`} className="text-xs text-steel">
          Fields marked <span className="text-brand-deep">*</span> are required.
        </p>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Website</label>
        <input id={fieldId("website")} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          {label("name", "Full Name", true)}
          <input {...aria("name")} type="text" autoComplete="name" required value={values.name} onChange={update("name")} className={inputClass(!!errors.name)} placeholder="Jane Smith" />
          {errorText("name")}
        </div>
        <div>
          {label("businessName", "Business Name")}
          <input {...aria("businessName")} type="text" autoComplete="organization" value={values.businessName} onChange={update("businessName")} className={inputClass(!!errors.businessName)} placeholder="Your company" />
          {errorText("businessName")}
        </div>
        <div>
          {label("phone", "Phone Number", true)}
          <input {...aria("phone")} type="tel" autoComplete="tel" inputMode="tel" required value={values.phone} onChange={update("phone")} className={inputClass(!!errors.phone)} placeholder="519-555-0123" />
          {errorText("phone")}
        </div>
        <div>
          {label("email", "Email Address", true)}
          <input {...aria("email")} type="email" autoComplete="email" required value={values.email} onChange={update("email")} className={inputClass(!!errors.email)} placeholder="you@business.com" />
          {errorText("email")}
        </div>
        <div>
          {label("service", "Service Needed", true)}
          <div className="relative">
            <select {...aria("service")} required value={values.service} onChange={update("service")} className={`${inputClass(!!errors.service)} appearance-none pr-10`}>
              <option value="" disabled>
                Select a service
              </option>
              {QUOTE_SERVICE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-graphite" aria-hidden="true" />
          </div>
          {errorText("service")}
        </div>
        <div>
          {label("location", "Project Location")}
          <input {...aria("location")} type="text" autoComplete="address-level2" value={values.location} onChange={update("location")} className={inputClass(!!errors.location)} placeholder="e.g. Windsor, Tecumseh, Lakeshore" />
          {errorText("location")}
        </div>
        <div className="sm:col-span-2">
          {label("message", "Project Details", true)}
          <textarea
            {...aria("message")}
            required
            rows={6}
            value={values.message}
            onChange={update("message")}
            className={`${inputClass(!!errors.message)} min-h-40 resize-y`}
            placeholder="What are you looking for? Include sizes, quantities, where it will be installed and your ideal timeline if you know them."
          />
          <div className="flex justify-between gap-4">
            {errorText("message") ?? <span />}
            <p className="mt-1.5 text-xs text-steel">{values.message.length}/5000</p>
          </div>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-3 font-display text-xs font-bold tracking-[0.12em] text-ink uppercase">Preferred Contact Method</legend>
          <div className="flex flex-wrap gap-2">
            {PREFERRED_CONTACT_OPTIONS.map((option) => {
              const selected = values.preferredContact === option;
              return (
                <label
                  key={option}
                  className={`relative flex cursor-pointer items-center gap-2 rounded-[4px] border px-4 py-2.5 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${
                    selected ? "border-ink bg-ink text-white" : "border-ink/15 text-graphite hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredContact"
                    value={option}
                    checked={selected}
                    onChange={update("preferredContact")}
                    className="sr-only"
                  />
                  <span className={`size-3 rounded-full border-2 ${selected ? "border-brand bg-brand" : "border-steel"}`} aria-hidden="true" />
                  {option === "Either" ? "Either is fine" : option}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <p className="mb-2 font-display text-xs font-bold tracking-[0.12em] text-ink uppercase">
            Files <span className="ml-1 font-sans text-[0.7rem] font-medium tracking-normal text-steel normal-case">(optional)</span>
          </p>
          <AttachmentUploader key={uploaderKey} onChange={setAttachments} onBusyChange={setUploading} disabled={submitting} email={email} />
        </div>
      </div>

      {formError ? (
        <p role="alert" className="mt-6 rounded-[4px] border border-brand/30 bg-brand/5 px-4 py-3 text-sm font-medium text-brand-deep">
          {formError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-steel sm:max-w-xs">We use your details only to respond to this request. No spam, ever.</p>
        <Button
          type="submit"
          size="lg"
          disabled={submitting || uploading}
          aria-busy={submitting}
          icon={submitting ? undefined : <ArrowRight className="size-4" aria-hidden="true" />}
          className="w-full sm:w-auto"
        >
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : uploading ? (
            "Uploading files…"
          ) : (
            "Send Quote Request"
          )}
        </Button>
      </div>
    </form>
  );
}
