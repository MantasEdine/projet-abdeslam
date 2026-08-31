import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { asFormulas, asFaqs } from "@/lib/types";
import { Arrow, Check } from "@/components/icons";
import { CtaBand, SectionHead, NightRail, Faq } from "@/components/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getService(slug: string) {
  return db.service.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return { title: "Service introuvable" };
  return {
    title: s.metaTitle || s.title,
    description: s.metaDesc,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.metaTitle || s.title, description: s.metaDesc, images: [s.heroImage] },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getService(slug), getSettings()]);
  if (!service) notFound();

  const formulas = asFormulas(service.formulas);
  const faqs = asFaqs(service.faqs);
  const isRondes = service.slug === "rondes";

  return (
    <>
      <section className="phero">
        <div className="phero__bg">
          <img src={service.heroImage} alt="" aria-hidden width={1400} height={900} fetchPriority="high" />
        </div>
        <div className="grain" aria-hidden />
        <div className="wrap">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden>/</span> <span>{service.title}</span>
          </nav>
          <span className="eyebrow">{service.tagline}</span>
          <h1 className="h-xl">{service.title}</h1>
          <p className="lead">{service.intro}</p>
          <div className="hero__actions">
            <Link className="btn btn--gold" href="/contact">Demander un devis <Arrow size={16} /></Link>
            <a className="btn btn--ghost" href={`tel:${settings.phone}`} data-evt="tel">{settings.phoneDisplay}</a>
          </div>
        </div>
      </section>

      {isRondes && (
        <section className="section">
          <div className="wrap">
            <div className="night" data-rv="0">
              <div className="sec-head" style={{ marginBottom: 0 }}>
                <span className="eyebrow">Exemple : formule 2 passages</span>
                <h2 className="h-l">Une nuit type sur votre site.</h2>
                <p className="lead">
                  Voici à quoi ressemble concrètement une prestation à deux passages. Les heures
                  changent chaque nuit — c&apos;est précisément ce qui rend la ronde efficace :
                  personne ne peut apprendre votre rythme.
                </p>
              </div>
              <NightRail />
              <div className="night__foot">
                <span className="pill"><span className="dot" /> Anomalie → levée de doute immédiate</span>
                <span className="pill">Astreinte joignable toute la nuit</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap split">
          <div className="split__media" data-rv="0">
            <img src={service.cardImage} alt={service.title} width={720} height={495} loading="lazy" />
          </div>
          <div className="prose" data-rv="80">
            <span className="eyebrow">La prestation</span>
            <h2 className="h-l">{service.bodyTitle}</h2>
            <div dangerouslySetInnerHTML={{ __html: service.bodyHtml }} />
            <h3>Ce qui est pris en charge</h3>
            <ul>
              {service.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {formulas.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <SectionHead eyebrow="Formules" title="Choisissez le niveau qui correspond à votre site." />
            <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(formulas.length, 3)},1fr)` }}>
              {formulas.map((f, i) => (
                <div className="card" data-rv={i * 70} key={f.title}>
                  <span className="card__num">{f.label}</span>
                  <h3 className="h-s">{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <SectionHead eyebrow="Questions fréquentes" title={`${service.title} en pratique.`} />
            <Faq items={faqs} />
          </div>
        </section>
      )}

      <CtaBand title={service.ctaTitle} text={service.ctaText} phone={settings.phone} />
    </>
  );
}
