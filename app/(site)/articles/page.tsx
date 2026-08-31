import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { Arrow } from "@/components/icons";
import { CtaBand } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conseils & actualités — Sécurité privée",
  description:
    "Nos analyses sur la protection des sites, les rondes de surveillance, la réglementation CNAPS et la vidéoprotection en France.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const [articles, settings] = await Promise.all([
    db.article.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
    getSettings(),
  ]);

  return (
    <>
      <section className="phero">
        <div className="grain" aria-hidden />
        <div className="wrap">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden>/</span> <span>Conseils</span>
          </nav>
          <span className="eyebrow">Le blog</span>
          <h1 className="h-xl">Conseils &amp; actualités</h1>
          <p className="lead">
            Ce que nous voyons sur le terrain, ce que dit la loi française, et ce qui protège
            réellement un site. Sans jargon commercial.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {articles.length === 0 ? (
            <p className="lead">Aucun article publié pour le moment.</p>
          ) : (
            <div className="posts">
              {articles.map((a, i) => (
                <article className="post" data-rv={(i % 3) * 80} key={a.slug}>
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
          )}
        </div>
      </section>

      <CtaBand
        title="Une question sur votre site ?"
        text="Nos conseils écrits ne remplacent pas une visite. Dites-nous ce que vous voulez protéger, nous vous répondons concrètement."
        phone={settings.phone}
      />
    </>
  );
}
