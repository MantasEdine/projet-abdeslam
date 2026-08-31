import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import { Arrow, Check, Star, Shield, Clock, Home, Doc } from "@/components/icons";
import { CtaBand, SectionHead, NightRail, Faq } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Regiis Security — Gardiennage, rondes de nuit & alarmes | Senlis, Oise",
  description:
    "Société de sécurité privée : gardiennage sur site, rondes de surveillance de nuit, alarmes et télésurveillance avec intervention 24/7. Devis gratuit sous 24 h. Senlis, Oise, Hauts-de-France et Île-de-France.",
  alternates: { canonical: "/" },
};

const SECTORS = [
  { h: "Chantiers & BTP", p: "Protection du matériel, des engins et des matériaux hors horaires de travail.", d: "M2 20h20M4 20V9l8-5 8 5v11 M9 20v-6h6v6" },
  { h: "Entrepôts & logistique", p: "Contrôle des quais, du parc de remorques et des accès poids lourds.", d: "M3 21V8l9-5 9 5v13 M3 21h18M8 21v-7h8v7" },
  { h: "Commerces & retail", p: "Dissuasion, surveillance des vitrines et fermeture sécurisée du magasin.", d: "M3 9 4.5 4h15L21 9 M4 9v11h16V9 M3 9h18" },
  { h: "Résidences & copropriétés", p: "Rondes dans les parties communes, parkings et caves, tranquillité des résidents.", d: "M3 21V7l7-4 7 4v14 M17 21V11h4v10M3 21h18" },
  { h: "Bureaux & tertiaire", p: "Accueil, filtrage des visiteurs et sécurisation des locaux en dehors des heures.", d: "M3 3h18v18H3z M8 8h3v3H8zM13 8h3v3h-3zM8 13h3v3H8zM13 13h3v3h-3z" },
  { h: "Sites industriels", p: "Grands périmètres, zones techniques sensibles et contrôle des flux véhicules.", d: "M4 21V10l8-6 8 6v11" },
];

const WHY = [
  { I: Shield, h: "Agents habilités", p: "Personnel titulaire d'une carte professionnelle, formé, équipé et assuré." },
  { I: Clock, h: "Traçabilité réelle", p: "Chaque passage est pointé et horodaté. Vous recevez le rapport, pas une promesse." },
  { I: Home, h: "Ancrage local", p: "Basés à Senlis, nous intervenons vite parce que nous sommes déjà sur le secteur." },
  { I: Doc, h: "Contrat clair", p: "Prestation détaillée, tarif ferme, sans reconduction automatique cachée." },
];

const STEPS = [
  { n: "ÉTAPE 01", h: "Prise de contact", p: "Vous décrivez votre site, vos horaires et ce qui vous inquiète. Par téléphone ou via le formulaire." },
  { n: "ÉTAPE 02", h: "Visite technique", p: "Nous venons sur place repérer les accès, les angles morts et les points à contrôler en priorité." },
  { n: "ÉTAPE 03", h: "Devis sous 24 h", p: "Une proposition chiffrée et détaillée : nombre de passages, horaires, effectifs, matériel." },
  { n: "ÉTAPE 04", h: "Mise en service", p: "Consignes écrites, remise des accès, premier passage — et votre premier rapport dès le lendemain." },
];

const QUOTES = [
  { i: "CM", n: "Conducteur de travaux", s: "Chantier — Oise", q: "Deux passages par nuit sur notre chantier depuis six mois. Les vols de matériel se sont arrêtés net, et je reçois le rapport chaque matin avant 8 h." },
  { i: "SD", n: "Gérante de commerce", s: "Centre-ville — Senlis", q: "L'alarme s'est déclenchée un dimanche à 3 h. Un agent était sur place avant que j'aie fini de m'habiller. C'est exactement pour ça qu'on paie." },
  { i: "RL", n: "Responsable logistique", s: "Entrepôt — Hauts-de-France", q: "Agent d'accueil du lundi au vendredi, rondes le week-end. Un seul contrat, un seul interlocuteur, et des agents qu'on finit par connaître." },
];

const FAQS = [
  { q: "Une ronde, c'est quoi exactement ?", a: "Un agent se déplace jusqu'à votre site et effectue un tour de contrôle complet : extérieurs, ouvrants, issues de secours, parkings, zones de stockage. Il repart ensuite, et revient plus tard dans la nuit. C'est la solution quand une présence permanente n'est pas justifiée : vous obtenez de la dissuasion et une vérification réelle, pour une fraction du coût d'un poste fixe." },
  { q: "Combien de passages par nuit faut-il prévoir ?", a: "Deux passages couvrent la majorité des besoins : un en début de nuit, un avant l'aube. Sur les sites très exposés — chantiers avec engins, entrepôts, stocks de métaux — nous montons à quatre ou six. Les horaires changent chaque nuit pour rester imprévisibles." },
  { q: "Comment savoir que l'agent est bien passé ?", a: "Chaque passage est pointé et horodaté sur place. Vous recevez un compte rendu avec les heures réelles de passage, les anomalies constatées et, si besoin, des photos. Aucun passage ne repose sur la parole de l'agent." },
  { q: "Intervenez-vous quand l'alarme se déclenche ?", a: "Oui. Sur déclenchement, notre astreinte procède à la levée de doute et envoie un agent sur place. Il constate, sécurise, prévient les forces de l'ordre si nécessaire, vous appelle et rédige un rapport d'intervention." },
  { q: "Quelles zones couvrez-vous ?", a: "Senlis et l'ensemble de l'Oise en priorité, ainsi que les Hauts-de-France et le nord de l'Île-de-France. Pour les sites en limite de secteur, contactez-nous : nous vous dirons franchement si nous pouvons tenir le délai d'intervention annoncé." },
  { q: "Faut-il s'engager sur une longue durée ?", a: "Non. Nous travaillons aussi bien sur des missions ponctuelles — une fermeture d'usine, un chantier de trois semaines, un événement — que sur des contrats annuels. Le devis précise la durée, le préavis et le tarif ferme." },
];

const MARQUEE = ["Chantiers & BTP", "Entrepôts & logistique", "Commerces", "Résidences & copropriétés", "Bureaux & tertiaire", "Concessions automobiles", "Événementiel", "Sites industriels"];

export default async function HomePage() {
  const settings = await getSettings();
  const [services, articles] = await Promise.all([
    db.service.findMany({ where: { published: true }, orderBy: { position: "asc" } }),
    db.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true, coverImage: true, tags: true, readMinutes: true },
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SecurityService",
    name: SITE.name,
    url: SITE.url,
    image: `${SITE.url}/assets/img/og.jpg`,
    telephone: settings.phone,
    email: settings.email,
    description: "Sécurité privée : gardiennage, rondes de surveillance et alarmes télésurveillées.",
    address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.city, postalCode: SITE.address.zip, addressCountry: "FR" },
    areaServed: SITE.areas,
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Services de sécurité", itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title } })) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="hero">
        <div className="hero__bg">
          <picture>
            <source srcSet="/assets/img/hero.webp" type="image/webp" />
            <img src="/assets/img/hero.jpg" alt="" aria-hidden fetchPriority="high" width={1600} height={1066} />
          </picture>
        </div>
        <div className="grain" aria-hidden />
        <div className="wrap hero__in">
          <div>
            <span className="pill" data-rv="0"><span className="dot" /> Intervention 24 h/24 · 7 j/7</span>
            <h1 className="h-xl" data-rv="60">Votre site sous<br /><em>surveillance réelle.</em></h1>
            <p className="lead" data-rv="120">
              Regiis Security protège entreprises, chantiers, commerces et résidences dans l&apos;Oise,
              les Hauts-de-France et l&apos;Île-de-France. Agents de gardiennage sur site, rondes de
              surveillance nocturnes et alarmes télésurveillées — un seul interlocuteur, une main
              courante horodatée, et quelqu&apos;un qui se déplace vraiment.
            </p>
            <div className="hero__actions" data-rv="180">
              <Link className="btn btn--gold" href="/contact">Obtenir un devis gratuit <Arrow size={16} /></Link>
              <Link className="btn btn--ghost" href="#services">Découvrir nos services</Link>
            </div>
            <div className="hero__note" data-rv="240">
              <span><Check size={14} /> Agents titulaires d&apos;une carte professionnelle</span>
              <span><Check size={14} /> Devis sous 24 h</span>
              <span><Check size={14} /> Sans engagement de longue durée</span>
            </div>
          </div>

          <div className="hero__card" data-rv="140">
            <span className="pill hero__badge"><span className="dot" /> Agent en ronde</span>
            <picture>
              <source srcSet="/assets/img/gardiennage.webp" type="image/webp" />
              <img src="/assets/img/gardiennage.jpg" alt="Agent de sécurité Regiis Security en poste devant un site protégé" width={900} height={1080} />
            </picture>
            <div className="hero__chip">
              <div><b data-count="15" data-suffix=" min">0</b><small>Délai d&apos;intervention moyen</small></div>
              <span className="sep" />
              <div><b data-count="24" data-suffix="/7">0</b><small>Astreinte permanente</small></div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden>
        <div className="marquee__track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="wrap">
          <SectionHead
            eyebrow="Nos services"
            title="Trois façons de sécuriser vos locaux."
            lead="Présence humaine, passages programmés ou détection électronique — chaque site a son équilibre. Nous le construisons avec vous, puis nous le tenons."
          />
          <div className="svc">
            {services.map((s, i) => (
              <article className="svc__item" data-rv={i * 90} key={s.id}>
                <div className="svc__media">
                  <span className="pill svc__tag">{s.tagline}</span>
                  <img src={s.cardImage} alt={s.title} width={720} height={495} loading="lazy" />
                </div>
                <div className="svc__body">
                  <h3 className="h-m">{s.title}</h3>
                  <p>{s.excerpt}</p>
                  <ul className="svc__list">
                    {s.features.slice(0, 4).map((f) => (
                      <li key={f}><Check /> {f}</li>
                    ))}
                  </ul>
                  <Link className="link-arrow" href={`/services/${s.slug}`}>
                    En savoir plus <Arrow />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NUIT TYPE */}
      <section className="section section--tight" id="rondes">
        <div className="wrap">
          <div className="night" data-rv="0">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Une ronde, concrètement</span>
              <h2 className="h-l">Ce qu&apos;il se passe sur votre site pendant que vous dormez.</h2>
              <p className="lead">
                Exemple d&apos;une prestation à <strong>deux passages par nuit</strong> sur un entrepôt.
                Les horaires ci-dessous sont volontairement décalés d&apos;une nuit sur l&apos;autre :
                personne ne doit pouvoir deviner quand l&apos;agent arrive.
              </p>
            </div>
            <NightRail />
            <div className="night__foot">
              <span className="pill"><span className="dot" /> Anomalie détectée → levée de doute immédiate</span>
              <span className="pill">Astreinte joignable toute la nuit</span>
              <Link className="link-arrow" href="/services/rondes" style={{ marginLeft: "auto" }}>
                Tout savoir sur les rondes <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section className="section" id="apropos">
        <div className="wrap split split--stretch">
          <div className="split__media" data-rv="0">
            <picture>
              <source srcSet="/assets/img/about.webp" type="image/webp" />
              <img src="/assets/img/about.jpg" alt="Agent Regiis Security équipé d'une radio lors d'une mission" width={980} height={760} loading="lazy" />
            </picture>
            <div className="split__stat"><b data-count="100" data-suffix="%">0</b><small>Agents titulaires d&apos;une carte pro</small></div>
          </div>
          <div data-rv="80">
            <span className="eyebrow">Pourquoi Regiis</span>
            <h2 className="h-l">Une société à taille humaine, joignable la nuit.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Regiis Security est une société de sécurité privée basée à Senlis. Nous couvrons l&apos;Oise
              et sa périphérie avec des équipes locales : le même agent revient sur votre site, il
              connaît vos accès, vos habitudes et vos points sensibles.
            </p>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 34 }}>
              {WHY.map(({ I, h, p }) => (
                <div className="card" key={h}>
                  <div className="icon-box"><I /></div>
                  <h3 className="h-s">{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="stats" data-rv="0">
            <div><b data-count="24" data-suffix="/7">0</b><small>Astreinte et interventions</small></div>
            <div><b data-count="15" data-suffix=" min">0</b><small>Délai moyen d&apos;intervention</small></div>
            <div><b data-count="6">0</b><small>Passages par nuit possibles</small></div>
            <div><b data-count="24" data-suffix=" h">0</b><small>Pour recevoir votre devis</small></div>
          </div>
        </div>
      </section>

      {/* SECTEURS */}
      <section className="section" id="secteurs">
        <div className="wrap">
          <SectionHead eyebrow="Secteurs d'intervention" title="Nous connaissons déjà votre type de site." />
          <div className="sectors">
            {SECTORS.map((s, i) => (
              <div className="sector" data-rv={(i % 3) * 50} key={s.h}>
                <div className="icon-box">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={s.d} />
                  </svg>
                </div>
                <div><h4>{s.h}</h4><p>{s.p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section--tight">
        <div className="wrap">
          <SectionHead eyebrow="Comment ça se passe" title="De l'appel au premier passage : 4 étapes." />
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" data-rv={i * 70} key={s.n}>
                <span className="step__n">{s.n}</span>
                <h4>{s.h}</h4>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      {articles.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="Conseils & actualités" title="Comprendre la sécurité privée." lead="Nos analyses sur la protection des sites, la réglementation française et ce qui fonctionne réellement sur le terrain." />
            <div className="posts">
              {articles.map((a, i) => (
                <article className="post" data-rv={i * 80} key={a.slug}>
                  <Link href={`/articles/${a.slug}`} className="post__media">
                    <img src={a.coverImage} alt="" aria-hidden width={720} height={450} loading="lazy" />
                  </Link>
                  <div className="post__body">
                    <div className="post__meta">
                      {a.tags[0] && <span className="tag">{a.tags[0]}</span>}
                      <span>{a.readMinutes} min de lecture</span>
                    </div>
                    <h3><Link href={`/articles/${a.slug}`}>{a.title}</Link></h3>
                    <p>{a.excerpt}</p>
                    <Link className="link-arrow" href={`/articles/${a.slug}`}>Lire l&apos;article <Arrow /></Link>
                  </div>
                </article>
              ))}
            </div>
            <div style={{ marginTop: 34 }} data-rv="0">
              <Link className="btn btn--ghost" href="/articles">Tous les articles <Arrow size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* TÉMOIGNAGES */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Ils nous font confiance" title="Ce que disent nos clients." />
          <div className="quotes">
            {QUOTES.map((q, i) => (
              <figure className="quote" data-rv={i * 80} key={q.i}>
                <div className="quote__stars" aria-label="5 étoiles sur 5">
                  {[0, 1, 2, 3, 4].map((k) => <Star key={k} />)}
                </div>
                <p>« {q.q} »</p>
                <footer>
                  <span className="avatar">{q.i}</span>
                  <div><b>{q.n}</b><small>{q.s}</small></div>
                </footer>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--tight" id="faq">
        <div className="wrap">
          <SectionHead eyebrow="Questions fréquentes" title="Ce qu'on nous demande le plus souvent." />
          <Faq items={FAQS} />
        </div>
      </section>

      <CtaBand
        title="Dites-nous ce que vous voulez protéger."
        text="Un échange de dix minutes suffit à savoir s'il vous faut un agent posté, deux rondes par nuit ou une alarme reliée à notre astreinte. C'est gratuit et sans engagement."
        phone={settings.phone}
      />
    </>
  );
}
