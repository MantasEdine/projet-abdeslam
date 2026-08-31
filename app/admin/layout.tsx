import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/icons";
import { AdminNav } from "@/components/admin/nav";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Le middleware protège déjà /admin/* : sans session, on ne peut être que sur
  // /admin/login, qui s'affiche alors sans la coquille d'administration.
  const session = await getSession();
  if (!session) return <>{children}</>;

  return (
    <div className="adm">
      <aside className="adm__side">
        <Link className="logo" href="/admin">
          <Logo id="lga" />
          <span>REGIIS<small>Admin</small></span>
        </Link>

        <AdminNav role={session.role} />

        <div className="adm__foot">
          <div className="adm__me">
            <span className="avatar">{session.name.slice(0, 2).toUpperCase()}</span>
            <div>
              <b>{session.name}</b>
              <small>{session.role === "OWNER" ? "Propriétaire" : "Éditeur"}</small>
            </div>
          </div>
          <div className="row-actions" style={{ marginTop: 10 }}>
            <Link className="btn btn--ghost btn--xs" href="/" target="_blank">Voir le site</Link>
            <form action={logoutAction}>
              <button className="btn btn--ghost btn--xs" type="submit">Déconnexion</button>
            </form>
          </div>
        </div>
      </aside>

      <div className="adm__main">{children}</div>
    </div>
  );
}
