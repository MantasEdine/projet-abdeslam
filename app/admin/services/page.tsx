import Link from "next/link";
import { db } from "@/lib/db";
import { DeleteButton } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const ok = (await searchParams).ok;
  const services = await db.service.findMany({ orderBy: { position: "asc" } });

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Services</h1>
          <p>Les prestations affichées sur le site. Le contenu actuel est déjà en place — modifiez-le librement.</p>
        </div>
        <div className="adm__actions">
          <Link className="btn btn--gold btn--sm" href="/admin/services/new">Nouveau service</Link>
        </div>
      </div>

      {ok && <div className="notice notice--ok" style={{ marginBottom: 18 }}>Service enregistré.</div>}

      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Service</th><th>URL</th><th className="num">Ordre</th><th>Statut</th><th /></tr></thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.title}</b><br />
                  <span style={{ fontSize: ".8rem" }}>{s.excerpt.slice(0, 90)}…</span>
                </td>
                <td><Link href={`/services/${s.slug}`} target="_blank">/services/{s.slug}</Link></td>
                <td className="num">{s.position}</td>
                <td><span className={`badge badge--${s.published ? "on" : "off"}`}>{s.published ? "Publié" : "Brouillon"}</span></td>
                <td>
                  <div className="row-actions">
                    <Link className="btn btn--ghost btn--xs" href={`/admin/services/${s.id}`}>Modifier</Link>
                    <DeleteButton id={s.id} kind="service" />
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
