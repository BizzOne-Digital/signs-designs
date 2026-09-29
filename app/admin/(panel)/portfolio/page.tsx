import type { Metadata } from "next";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export const metadata: Metadata = { title: "Portfolio" };

export default function AdminPortfolioPage() {
  return <PortfolioManager />;
}
