import { HeaderClient } from "@/components/layout/HeaderClient";
import type { SiteSettingsDTO } from "@/lib/types";

export function Header({ settings }: { settings: SiteSettingsDTO }) {
  return <HeaderClient phone={settings.phone} email={settings.email} facebook={settings.facebook} logoUrl={settings.logo} />;
}
