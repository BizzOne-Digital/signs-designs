import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, FolderKanban, Inbox, Mail, Newspaper, Plus, Sparkles } from "lucide-react";
import { AdminPageHeader, Badge, STATUS_TONES } from "@/components/admin/ui";
import { dbConnect, isDatabaseConfigured } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { formatDateTime } from "@/lib/format";
import QuoteRequest from "@/models/QuoteRequest";
import PortfolioProject from "@/models/PortfolioProject";
import BlogPost from "@/models/BlogPost";

export const metadata: Metadata = { title: "Dashboard" };

async function loadDashboard() {
  if (!isDatabaseConfigured()) return { ok: false as const, reason: "MONGODB_URI is not set. Add it to your environment variables to enable the admin panel." };
  try {
    await dbConnect();
    await ensureSeeded();
    const [total, fresh, projects, posts, published, recent] = await Promise.all([
      QuoteRequest.countDocuments(),
      QuoteRequest.countDocuments({ status: "new" }),
      PortfolioProject.countDocuments(),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: "published" }),
      QuoteRequest.find().sort({ createdAt: -1 }).limit(6).select({ name: 1, businessName: 1, service: 1, status: 1, createdAt: 1 }).lean(),
    ]);
    return { ok: true as const, total, fresh, projects, posts, published, recent };
  } catch (error) {
    console.error("[admin] dashboard failed:", error);
    return { ok: false as const, reason: "The database could not be reached. Check MONGODB_URI and your Atlas network access settings." };
  }
}

export default async function AdminDashboardPage() {
  const data = await loadDashboard();

  if (!data.ok) {
    return (
      <>
        <AdminPageHeader title="Dashboard" />
        <div className="flex gap-4 rounded-[var(--radius-card)] border border-amber-300 bg-amber-50 p-6 text-amber-900">
          <AlertTriangle className="size-6 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold">Database unavailable</p>
            <p className="mt-1 text-sm">{data.reason}</p>
          </div>
        </div>
      </>
    );
  }

  const cards = [
    { label: "Total Quote Requests", value: data.total, icon: Inbox, href: "/admin/inquiries", note: "All time" },
    { label: "New Inquiries", value: data.fresh, icon: Sparkles, href: "/admin/inquiries?status=new", note: data.fresh > 0 ? "Need a response" : "All caught up", highlight: data.fresh > 0 },
    { label: "Portfolio Projects", value: data.projects, icon: FolderKanban, href: "/admin/portfolio", note: "Projects in gallery" },
    { label: "Blog Posts", value: data.posts, icon: Newspaper, href: "/admin/blogs", note: `${data.published} published` },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of quote requests and website content."
        actions={
          <>
            <Link href="/admin/portfolio" className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-ink px-4 text-xs font-bold tracking-wide text-white uppercase hover:bg-charcoal">
              <Plus className="size-4" aria-hidden="true" /> Add project
            </Link>
            <Link href="/admin/blogs" className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-ink/15 bg-white px-4 text-xs font-bold tracking-wide text-ink uppercase hover:bg-fog">
              <Plus className="size-4" aria-hidden="true" /> New post
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href, note, highlight }) => (
          <Link
            key={label}
            href={href}
            className={`group relative overflow-hidden rounded-[var(--radius-card)] border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift ${highlight ? "border-brand/40" : "border-ink/10"}`}
          >
            {highlight ? <span className="absolute top-0 left-0 h-1 w-full bg-brand" aria-hidden="true" /> : null}
            <div className="flex items-start justify-between">
              <p className="text-xs font-bold tracking-[0.1em] text-steel uppercase">{label}</p>
              <span className={`flex size-9 items-center justify-center rounded-[4px] ${highlight ? "bg-brand text-white" : "bg-fog text-graphite"}`}>
                <Icon className="size-[1.1rem]" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 font-display text-4xl font-extrabold text-ink">{value}</p>
            <p className={`mt-1 text-xs font-medium ${highlight ? "text-brand-deep" : "text-steel"}`}>{note}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card" aria-labelledby="recent-heading">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 id="recent-heading" className="font-display text-sm font-extrabold tracking-[0.1em]">
            Recent quote requests
          </h2>
          <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-xs font-bold text-brand-deep uppercase hover:text-brand">
            View all <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        {data.recent.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <Mail className="size-8 text-steel/60" aria-hidden="true" />
            <p className="mt-3 text-sm text-steel">No quote requests yet. New submissions from the website will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10">
            {data.recent.map((item) => (
              <li key={String(item._id)}>
                <Link href={`/admin/inquiries?open=${String(item._id)}`} className="flex flex-col gap-1 px-5 py-3.5 transition hover:bg-fog/60 sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {item.name}
                      {item.businessName ? <span className="font-normal text-steel"> · {item.businessName}</span> : null}
                    </p>
                    <p className="text-xs text-steel">{item.service}</p>
                  </div>
                  <p className="text-xs text-steel">{formatDateTime(item.createdAt)}</p>
                  <Badge tone={STATUS_TONES[item.status]}>{item.status}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
