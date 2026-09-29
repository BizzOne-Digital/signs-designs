import type { Metadata } from "next";
import { BlogManager } from "@/components/admin/BlogManager";

export const metadata: Metadata = { title: "Blog" };

export default function AdminBlogPage() {
  return <BlogManager />;
}
