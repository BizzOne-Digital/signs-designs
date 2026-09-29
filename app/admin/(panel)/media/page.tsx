import type { Metadata } from "next";
import { MediaManager } from "@/components/admin/MediaManager";

export const metadata: Metadata = { title: "Media" };

export default function AdminMediaPage() {
  return <MediaManager />;
}
