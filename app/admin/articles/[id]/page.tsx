import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArticleForm } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const article = await db.article.findUnique({ where: { id: (await params).id } });
  if (!article) notFound();

  return (
    <>
      <div className="adm__head">
        <div><h1>{article.title}</h1><p>{article.views} lecture{article.views > 1 ? "s" : ""} depuis la publication.</p></div>
        {article.published && (
          <div className="adm__actions">
            <Link className="btn btn--ghost btn--sm" href={`/articles/${article.slug}`} target="_blank">Voir l&apos;article</Link>
          </div>
        )}
      </div>
      <ArticleForm init={article} />
    </>
  );
}
