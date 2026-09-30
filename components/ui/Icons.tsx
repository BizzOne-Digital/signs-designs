import { Building2, Layers, Megaphone, PanelsTopLeft, PenTool, Printer, Signpost, Store, Truck, Wrench, type LucideIcon } from "lucide-react";
import type { ServiceIconKey } from "@/lib/constants";

export const SERVICE_ICON_MAP: Record<ServiceIconKey, LucideIcon> = {
  store: Store,
  "pen-tool": PenTool,
  truck: Truck,
  panels: PanelsTopLeft,
  megaphone: Megaphone,
  wrench: Wrench,
  layers: Layers,
  printer: Printer,
  building: Building2,
  signpost: Signpost,
};

export const SERVICE_ICON_LABELS: Record<ServiceIconKey, string> = {
  store: "Storefront",
  "pen-tool": "Design pen",
  truck: "Vehicle",
  panels: "Window / wall panels",
  megaphone: "Promotion",
  wrench: "Installation",
  layers: "Layers",
  printer: "Printing",
  building: "Development / real estate",
  signpost: "Wayfinding / interior sign",
};

export function ServiceIcon({ icon, className = "size-6" }: { icon: ServiceIconKey; className?: string }) {
  const Icon = SERVICE_ICON_MAP[icon] ?? Store;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}

/** Brand icons are not part of lucide-react, so the Facebook mark is a custom SVG. */
export function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
    </svg>
  );
}
