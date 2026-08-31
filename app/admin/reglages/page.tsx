import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await getSession();
  if (!me) redirect("/admin/login");
  if (me.role !== "OWNER") {
    return (
      <>
        <div className="adm__head"><div><h1>Coordonnées</h1></div></div>
        <div className="notice notice--err">Seuls les comptes « Propriétaire » peuvent modifier les coordonnées.</div>
      </>
    );
  }

  const settings = await getSettings();
  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Coordonnées</h1>
          <p>
            Ces valeurs alimentent tout le site : en-tête, pied de page, page contact, barre
            mobile et bulle WhatsApp.
          </p>
        </div>
      </div>
      <SettingsForm init={settings} />
    </>
  );
}
