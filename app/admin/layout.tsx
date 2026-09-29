import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin — Signs & Designs by Eric" },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
