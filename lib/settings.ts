import "server-only";
import { db } from "./db";
import { SITE } from "./site";

export type SiteSettings = {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
};

/** Lit les réglages en base, avec repli sur les constantes du code. */
export async function getSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    phone: SITE.phone,
    phoneDisplay: SITE.phoneDisplay,
    whatsapp: SITE.whatsapp,
    email: SITE.email,
  };
  try {
    const rows = await db.setting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      phone: map.phone || defaults.phone,
      phoneDisplay: map.phoneDisplay || defaults.phoneDisplay,
      whatsapp: map.whatsapp || defaults.whatsapp,
      email: map.email || defaults.email,
    };
  } catch {
    return defaults;
  }
}
