import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentions légales & confidentialité",
  description:
    "Mentions légales, informations sur l'éditeur, protection des données personnelles et politique de confidentialité du site Regiis Security.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

export default async function LegalPage() {
  const s = await getSettings();
  return (
    <>
      <section className="phero">
        <div className="grain" aria-hidden />
        <div className="wrap">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden>/</span> <span>Mentions légales</span>
          </nav>
          <span className="eyebrow">Informations légales</span>
          <h1 className="h-l">Mentions légales &amp; confidentialité</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <h2>Éditeur du site</h2>
          <p>
            <strong>{SITE.legalName}</strong><br />
            Société par actions simplifiée à associé unique (SASU)<br />
            Siège social : {SITE.address.street}, {SITE.address.zip} {SITE.address.city}, France<br />
            SIREN : 948 608 013 — SIRET (siège) : 948 608 013 00017<br />
            Téléphone : <a href={`tel:${s.phone}`}>{s.phoneDisplay}</a> — E-mail : <a href={`mailto:${s.email}`}>{s.email}</a>
          </p>

          <h2>Activité réglementée</h2>
          <p>
            Les activités privées de sécurité sont régies par le livre VI du code de la sécurité
            intérieure et placées sous le contrôle du Conseil national des activités privées de
            sécurité (CNAPS). L&apos;entreprise est titulaire d&apos;une autorisation d&apos;exercice
            et ses agents sont titulaires d&apos;une carte professionnelle en cours de validité.
          </p>
          <p>
            Conformément à l&apos;article L. 612-14 du code de la sécurité intérieure :
            l&apos;autorisation d&apos;exercice ne confère aucune prérogative de puissance publique
            à l&apos;entreprise ou aux personnes qui en bénéficient.
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par l&apos;hébergeur retenu par l&apos;éditeur, dont les coordonnées
            complètes sont disponibles sur simple demande à l&apos;adresse e-mail ci-dessus.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus de ce site — textes, mise en page, identité visuelle et
            éléments graphiques — est protégé par le droit de la propriété intellectuelle. Toute
            reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable
            est interdite.
          </p>
          <p>
            Les photographies utilisées sur ce site sont des images d&apos;illustration libres de
            droit pour un usage commercial.
          </p>

          <h2 id="confidentialite">Données personnelles</h2>
          <p>
            Les informations transmises via le formulaire de contact sont utilisées dans le seul but
            de répondre à votre demande et d&apos;établir, le cas échéant, une proposition
            commerciale. Elles ne sont ni revendues, ni cédées à des tiers.
          </p>
          <ul>
            <li>Données collectées : nom, société, e-mail, téléphone, commune du site et contenu du message.</li>
            <li>Base légale : votre consentement, recueilli au moment de l&apos;envoi du formulaire.</li>
            <li>Durée de conservation : 3 ans à compter du dernier contact.</li>
            <li>Destinataire : le personnel habilité de {SITE.legalName}, à l&apos;exclusion de tout tiers.</li>
          </ul>
          <p>
            Conformément au Règlement général sur la protection des données (RGPD) et à la loi
            Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement, de limitation, d&apos;opposition et de portabilité de vos données.
            Pour l&apos;exercer, écrivez à <a href={`mailto:${s.email}`}>{s.email}</a>. Vous pouvez
            également introduire une réclamation auprès de la CNIL (www.cnil.fr).
          </p>

          <h2>Mesure d&apos;audience</h2>
          <p>
            Ce site utilise une mesure d&apos;audience <strong>first-party</strong> : aucun cookie
            publicitaire, aucun traceur tiers, aucune donnée transmise à une régie. Un identifiant
            anonyme est conservé dans le stockage local de votre navigateur afin de distinguer les
            visites nouvelles des visites récurrentes, ainsi que la page consultée, la source du
            trafic et le type d&apos;appareil. Ces données ne permettent pas de vous identifier et
            ne sont jamais recoupées avec les informations du formulaire de contact.
          </p>

          <h2>Vidéoprotection</h2>
          <p>
            Les installations de vidéoprotection réalisées par {SITE.legalName} respectent le cadre
            légal applicable : information des personnes filmées, limitation du champ de vision aux
            espaces privés du client, durée de conservation des images encadrée et, pour les lieux
            ouverts au public, autorisation préfectorale préalable.
          </p>
        </div>
      </section>
    </>
  );
}
