import type { Metadata } from "next";
import { PagesManager } from "@/components/admin/PagesManager";

export const metadata: Metadata = { title: "Pages" };

export default function AdminPagesPage() {
  return <PagesManager />;
}
