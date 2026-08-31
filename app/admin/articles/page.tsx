import Link from "next/link";
import { db } from "@/lib/db";
import { DeleteButton } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

export default async function ArticlesAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const ok = (await searchParams).ok;
  const articles = await db.article.findMany({
    orderBy: [{ published: "desc" }, { publishedAt: "desc" }],
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Articles</h1>
          <p>Vos analyses sur la sécurité privée. Publier régulièrement améliore le référencement naturel.</p>
        </div>
        <div className="adm__actions">
          <Link className="btn btn--gold btn--sm" href="/admin/articles/new">Nouvel article</Link>
        </div>
      </div>

      {ok && <div className="notice notice--ok" style={{ marginBottom: 18 }}>Article enregistré.</div>}

      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Article</th><th>Étiquettes</th><th className="num">Lectures</th><th>Statut</th><th /></tr></thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td>
                  <b>{a.title}</b><br />
                  <span style={{ fontSize: ".8rem" }}>
                    {a.publishedAt
                      ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(a.publishedAt)
                      : "Non publié"}
                    {a.author && ` · ${a.author.name}`}
                  </span>
                </td>
                <td>{a.tags.map((t) => <span className="tag" key={t} style={{ marginRight: 6 }}>{t}</span>)}</td>
                <td className="num">{a.views}</td>
                <td><span className={`badge badge--${a.published ? "on" : "off"}`}>{a.published ? "Publié" : "Brouillon"}</span></td>
                <td>
                  <div className="row-actions">
                    <Link className="btn btn--ghost btn--xs" href={`/admin/articles/${a.id}`}>Modifier</Link>
                    <DeleteButton id={a.id} kind="article" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
