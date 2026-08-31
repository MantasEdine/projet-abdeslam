import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div className="wrap">
        <span className="eyebrow" style={{ justifyContent: "center" }}>Erreur 404</span>
        <h1 className="h-l">Cette page n&apos;existe pas.</h1>
        <p className="lead" style={{ margin: "18px auto 30px" }}>
          Le lien est peut-être obsolète. Revenez à l&apos;accueil ou dites-nous ce que vous cherchez.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn--gold" href="/">Retour à l&apos;accueil</Link>
          <Link className="btn btn--ghost" href="/contact">Nous contacter</Link>
        </div>
      </div>
    </div>
  );
}
