import {
  Building2,
  LayoutPanelTop,
  Megaphone,
  Sparkles,
  Star,
  Store,
  Trophy,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the `icon` column on the services table to a Lucide component. Unknown
 * names fall back to Star, so adding a service in Supabase never breaks a page.
 */
const ICONS: Record<string, LucideIcon> = {
  Building2,
  Sparkles,
  LayoutPanelTop,
  Megaphone,
  Truck,
  Trophy,
  Store,
  Star,
};

export function serviceIcon(name: string | undefined): LucideIcon {
  return (name && ICONS[name]) || Star;
}

export const iconNames = Object.keys(ICONS);
