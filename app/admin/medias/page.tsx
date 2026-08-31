import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

/** Liste les images disponibles dans /public/assets/img. */
async function listImages() {
  const dir = path.join(process.cwd(), "public", "assets", "img");
  try {
    const files = await fs.readdir(dir);
    const jpgs = files.filter((f) => /\.(jpe?g|png|webp|svg)$/i.test(f) && !f.endsWith(".webp"));
    const withSize = await Promise.all(
      jpgs.sort().map(async (f) => {
        const st = await fs.stat(path.join(dir, f));
        return { name: f, url: `/assets/img/${f}`, kb: Math.round(st.size / 1024) };
      })
    );
    return withSize;
  } catch {
    return [];
  }
}

export default async function MediaPage() {
  const images = await listImages();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Médias</h1>
          <p>
            Les images disponibles sur le site. Copiez un chemin pour l&apos;utiliser dans un
            service ou un article.
          </p>
        </div>
      </div>

      <div className="notice notice--ok" style={{ marginBottom: 22 }}>
        <b>Ajouter une image :</b> déposez le fichier dans <code>public/assets/img/</code> puis
        redéployez. Pour un envoi depuis le navigateur, activez Vercel Blob — voir le README,
        section « Médias ».
      </div>

      {images.length === 0 ? (
        <div className="panel"><p className="panel__empty">Aucune image trouvée.</p></div>
      ) : (
        <div className="grid-media">
          {images.map((img) => (
            <figure className="media-card" key={img.name}>
              <img src={img.url} alt={img.name} loading="lazy" />
              <div>{img.url}<br /><span style={{ opacity: .7 }}>{img.kb} Ko</span></div>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
