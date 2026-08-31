import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import { Arrow } from "@/components/icons";
import { CtaBand } from "@/components/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const getArticle = (slug: string) =>
  db.article.findFirst({ where: { slug, published: true }, include: { author: { select: { name: true } } } });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return { title: "Article introuvable" };
  return {
    title: a.metaTitle || a.title,
    description: a.metaDesc || a.excerpt,
    alternates: { canonical: `/articles/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.excerpt, images: [a.coverImage], publishedTime: a.publishedAt?.toISOString() },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([getArticle(slug), getSettings()]);
  if (!article) notFound();

  // compteur de lectures (non bloquant)
  db.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const more = await db.article.findMany({
    where: { published: true, NOT: { id: article.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { slug: true, title: true, excerpt: true, coverImage: true, tags: true, readMinutes: true },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${SITE.url}${article.coverImage}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  const date = article.publishedAt
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(article.publishedAt)
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="phero">
        <div className="grain" aria-hidden />
        <div className="wrap">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden>/</span>
            <Link href="/articles">Conseils</Link> <span aria-hidden>/</span> <span>{article.title}</span>
          </nav>
          <div className="post__meta" style={{ marginBottom: 16 }}>
            {article.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            <span>{article.readMinutes} min de lecture</span>
            {date && <span>· {date}</span>}
          </div>
          <h1 className="h-l" style={{ maxWidth: "22ch" }}>{article.title}</h1>
          <p className="lead" style={{ marginTop: 18 }}>{article.excerpt}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="article__cover">
            <img src={article.coverImage} alt="" aria-hidden width={1200} height={600} />
          </div>
          <div className="article" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </div>
      </section>

      {more.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <div className="sec-head" data-rv="0">
              <span className="eyebrow">À lire aussi</span>
              <h2 className="h-m">D&apos;autres articles</h2>
            </div>
            <div className="posts">
              {more.map((a) => (
                <article className="post" key={a.slug}>
                  <Link href={`/articles/${a.slug}`} className="post__media">
                    <img src={a.coverImage} alt="" aria-hidden width={720} height={450} loading="lazy" />
                  </Link>
                  <div className="post__body">
                    <div className="post__meta">
                      {a.tags[0] && <span className="tag">{a.tags[0]}</span>}
                      <span>{a.readMinutes} min</span>
                    </div>
                    <h3><Link href={`/articles/${a.slug}`}>{a.title}</Link></h3>
                    <Link className="link-arrow" href={`/articles/${a.slug}`}>Lire <Arrow /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Besoin d'un avis sur votre site ?"
        text="Un échange de dix minutes suffit à savoir ce qui est réellement adapté. C'est gratuit et sans engagement."
        phone={settings.phone}
      />
    </>
  );
}
