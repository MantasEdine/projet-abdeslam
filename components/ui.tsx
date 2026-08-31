import Link from "next/link";
import { Arrow } from "./icons";

export function CtaBand({ title, text, phone }: { title: string; text: string; phone: string }) {
  return (
    <section className="section section--tight">
      <div className="wrap">
        <div className="cta" data-rv="0">
          <picture>
            <source srcSet="/assets/img/cta.webp" type="image/webp" />
            <img src="/assets/img/cta.jpg" alt="" aria-hidden width={1600} height={760} loading="lazy" />
          </picture>
          <span className="pill"><span className="dot" /> Réponse sous 24 h ouvrées</span>
          <h2 className="h-l" style={{ marginTop: 18 }}>{title}</h2>
          <p className="lead">{text}</p>
          <div className="cta__actions">
            <Link className="btn btn--gold" href="/contact">Demander mon devis <Arrow size={16} /></Link>
            <a className="btn btn--ghost" href={`tel:${phone}`} data-evt="tel">Nous appeler</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow, title, lead, children,
}: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="sec-head" data-rv="0">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h-l">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </div>
  );
}

export const NIGHT_STEPS = [
  { t: "21:30", h: "Fermeture", p: "L'agent boucle le site : portails, issues de secours, coupure des accès. Le site passe en surveillance." },
  { t: "01:10", h: "1ᵉʳ passage", p: "Tour extérieur complet, contrôle des ouvrants, du parc véhicules et des zones de stockage. Pointage horodaté." },
  { t: "04:25", h: "2ᵉ passage", p: "Nouveau tour, itinéraire inversé. Vérification des points sensibles et de tout élément noté au 1ᵉʳ passage." },
  { t: "06:00", h: "Rapport", p: "Compte rendu horodaté envoyé le matin : heures réelles, anomalies constatées, photos si nécessaire." },
];

export function NightRail() {
  return (
    <div className="night__rail">
      <div className="night__line" aria-hidden />
      <ol className="night__steps">
        {NIGHT_STEPS.map((s) => (
          <li key={s.t}>
            <span className="night__pin">{s.t}</span>
            <h4>{s.h}</h4>
            <p>{s.p}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq" data-rv="0">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0} name="faq">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
