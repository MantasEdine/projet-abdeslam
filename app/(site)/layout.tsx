import { Suspense } from "react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyBar } from "@/components/sticky-bar";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";
import { Tracker } from "@/components/tracker";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const services = await db.service
    .findMany({
      where: { published: true },
      orderBy: { position: "asc" },
      select: { slug: true, title: true, navLabel: true },
    })
    .catch(() => []);

  const nav = [
    { href: "/", label: "Accueil" },
    ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.navLabel || s.title })),
    { href: "/articles", label: "Conseils" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <Suspense fallback={null}>
        <Tracker />
      </Suspense>
      <Reveal />
      <SiteHeader nav={nav} phone={settings.phone} phoneDisplay={settings.phoneDisplay} />
      <main>{children}</main>
      <SiteFooter
        phone={settings.phone}
        phoneDisplay={settings.phoneDisplay}
        email={settings.email}
        services={services}
      />
      <StickyBar phone={settings.phone} />
      <WhatsAppBubble phone={settings.whatsapp} message={SITE.whatsappMessage} />
    </>
  );
}
