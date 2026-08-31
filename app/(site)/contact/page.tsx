import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SITE, waLink } from "@/lib/site";
import { Phone, Mail, Pin, Clock, WhatsApp } from "@/components/icons";
import { ContactForm } from "@/components/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & devis gratuit — Senlis",
  description:
    "Contactez Regiis Security pour un devis gratuit de gardiennage, de rondes de surveillance ou d'alarme télésurveillée. Réponse sous 24 h ouvrées. Astreinte 24 h/24.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [settings, services] = await Promise.all([
    getSettings(),
    db.service.findMany({ where: { published: true }, orderBy: { position: "asc" }, select: { title: true } }),
  ]);

  return (
    <>
      <section className="phero">
        <div className="phero__bg">
          <picture>
            <source srcSet="/assets/img/hero.webp" type="image/webp" />
            <img src="/assets/img/hero.jpg" alt="" aria-hidden width={1600} height={1066} />
          </picture>
        </div>
        <div className="grain" aria-hidden />
        <div className="wrap">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden>/</span> <span>Contact</span>
          </nav>
          <span className="eyebrow">Devis gratuit</span>
          <h1 className="h-xl">Parlons de votre site.</h1>
          <p className="lead">
            Dix minutes suffisent à savoir s&apos;il vous faut un agent posté, deux rondes par nuit
            ou une alarme reliée à notre astreinte. Réponse sous 24 h ouvrées, sans engagement.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap contact">
          <div data-rv="0">
            <span className="eyebrow">Nous joindre</span>
            <h2 className="h-m">Directement, tout de suite.</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              Une urgence ou une intervention à organiser dans la journée ? Le téléphone reste le
              plus rapide — notre astreinte répond 24 h/24.
            </p>

            <div className="info-list">
              <div className="info">
                <div className="icon-box"><Phone size={20} /></div>
                <div><b>Téléphone — 24 h/24</b><a href={`tel:${settings.phone}`} data-evt="tel">{settings.phoneDisplay}</a></div>
              </div>
              <div className="info">
                <div className="icon-box" style={{ background: "rgba(37,211,102,.12)", borderColor: "rgba(37,211,102,.3)", color: "#25D366" }}>
                  <WhatsApp size={20} />
                </div>
                <div>
                  <b>WhatsApp</b>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" data-evt="whatsapp">
                    Démarrer une conversation
                  </a>
                </div>
              </div>
              <div className="info">
                <div className="icon-box"><Mail size={20} /></div>
                <div><b>E-mail</b><a href={`mailto:${settings.email}`}>{settings.email}</a></div>
              </div>
              <div className="info">
                <div className="icon-box"><Pin size={20} /></div>
                <div><b>Adresse</b><span>{SITE.address.street}<br />{SITE.address.zip} {SITE.address.city}</span></div>
              </div>
              <div className="info">
                <div className="icon-box"><Clock size={20} /></div>
                <div><b>Zone d&apos;intervention</b><span>{SITE.areas.join(" · ")}</span></div>
              </div>
            </div>
          </div>

          <Suspense fallback={null}>
            <ContactForm services={services.map((s) => s.title)} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
