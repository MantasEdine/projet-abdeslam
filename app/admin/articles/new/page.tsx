import { ArticleForm } from "@/components/admin/forms";
export const dynamic = "force-dynamic";

export default function NewArticlePage() {
  return (
    <>
      <div className="adm__head">
        <div><h1>Nouvel article</h1><p>Enregistrez-le en brouillon, publiez-le quand il vous convient.</p></div>
      </div>
      <ArticleForm
        init={{
          coverImage: "/assets/img/rondes.jpg",
          contentHtml: "<p>Premier paragraphe…</p>\n\n<h2>Un intertitre</h2>\n<p>Suite de l'article.</p>\n\n<ul>\n  <li>Un point clé</li>\n  <li>Un autre</li>\n</ul>\n\n<blockquote><p>Une citation qui résume l'idée.</p></blockquote>",
        }}
      />
    </>
  );
}
