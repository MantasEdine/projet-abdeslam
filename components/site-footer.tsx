import Link from "next/link";
import { Logo } from "./icons";

export function SiteFooter({
  phone, phoneDisplay, email, services,
}: {
  phone: string; phoneDisplay: string; email: string;
  services: { slug: string; title: string }[];
}) {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__grid">
          <div>
            <Link className="logo" href="/" style={{ marginBottom: 18 }}>
              <Logo id="lgf" />
              <span>REGIIS<small>Security</small></span>
            </Link>
            <p>
              Sécurité privée dans l&apos;Oise, les Hauts-de-France et l&apos;Île-de-France.
              Gardiennage, rondes de surveillance et alarmes télésurveillées.
            </p>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              {services.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>
              ))}
              <li><Link href="/#secteurs">Secteurs d&apos;intervention</Link></li>
            </ul>
          </div>
          <div>
            <h5>Société</h5>
            <ul>
              <li><Link href="/#apropos">À propos</Link></li>
              <li><Link href="/articles">Conseils &amp; actualités</Link></li>
              <li><Link href="/#faq">Questions fréquentes</Link></li>
              <li><Link href="/contact">Contact &amp; devis</Link></li>
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
            </ul>
          </div>
          <div>
            <h5>Nous joindre</h5>
            <ul>
              <li><a href={`tel:${phone}`} data-evt="tel">{phoneDisplay}</a></li>
              <li><a href={`mailto:${email}`}>{email}</a></li>
              <li className="muted" style={{ fontSize: ".92rem" }}>6-8 avenue de Creil<br />60300 Senlis</li>
            </ul>
            <Link className="btn btn--gold btn--sm" href="/contact" style={{ marginTop: 18 }}>Devis gratuit</Link>
          </div>
        </div>
        <div className="ftr__bottom">
          <span>© {new Date().getFullYear()} Regiis Security — Tous droits réservés.</span>
          <nav>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/mentions-legales#confidentialite">Confidentialité</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
