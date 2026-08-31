import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { AdminForm, DeleteButton } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const me = await getSession();
  if (!me) redirect("/admin/login");
  if (me.role !== "OWNER") {
    return (
      <>
        <div className="adm__head"><div><h1>Administrateurs</h1></div></div>
        <div className="notice notice--err">
          Seuls les comptes « Propriétaire » peuvent gérer les administrateurs.
        </div>
      </>
    );
  }

  const admins = await db.admin.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] });
  const dt = (d: Date | null) =>
    d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(d) : "Jamais";

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Administrateurs</h1>
          <p>Qui peut accéder à cet espace. Les éditeurs gèrent le contenu, les propriétaires gèrent tout.</p>
        </div>
      </div>

      <div className="tbl-wrap" style={{ marginBottom: 26 }}>
        <table className="tbl">
          <thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Dernière connexion</th><th>Statut</th><th /></tr></thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td><b>{a.name}</b>{a.id === me.sub && <span className="tag" style={{ marginLeft: 8 }}>vous</span>}</td>
                <td>{a.email}</td>
                <td>{a.role === "OWNER" ? "Propriétaire" : "Éditeur"}</td>
                <td>{dt(a.lastLoginAt)}</td>
                <td><span className={`badge badge--${a.active ? "on" : "off"}`}>{a.active ? "Actif" : "Désactivé"}</span></td>
                <td>{a.id !== me.sub && <DeleteButton id={a.id} kind="admin" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h-s" style={{ marginBottom: 14 }}>Ajouter un administrateur</h2>
      <AdminForm />

      <h2 className="h-s" style={{ margin: "34px 0 14px" }}>Modifier un compte existant</h2>
      <div style={{ display: "grid", gap: 18 }}>
        {admins.map((a) => (
          <details key={a.id} className="card-form" style={{ padding: 0 }}>
            <summary style={{ cursor: "pointer", padding: "18px 24px", fontWeight: 700 }}>
              {a.name} — {a.email}
            </summary>
            <div style={{ padding: "0 24px 24px" }}>
              <AdminForm init={a} isSelf={a.id === me.sub} />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
