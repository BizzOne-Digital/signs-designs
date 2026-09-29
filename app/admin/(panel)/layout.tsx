import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Server-side verification in addition to the proxy check.
  const session = await getAdminSession().catch(() => null);
  if (!session) redirect("/admin/login");

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
