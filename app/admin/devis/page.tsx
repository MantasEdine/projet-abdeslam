import { db } from "@/lib/db";
import { LEAD_STATUS, LeadStatusSelect, LeadNotes, DeleteButton } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const s = (await searchParams).s;
  const filter = STATUSES.includes(s as never) ? (s as (typeof STATUSES)[number]) : undefined;

  const [leads, counts] = await Promise.all([
    db.lead.findMany({ where: filter ? { status: filter } : {}, orderBy: { createdAt: "desc" }, take: 200 }),
    db.lead.groupBy({ by: ["status"], _count: { status: true } }),
  ]);
  const countOf = (k: string) => counts.find((c) => c.status === k)?._count.status ?? 0;
  const total = counts.reduce((n, c) => n + c._count.status, 0);
  const dt = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(d);

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Demandes de devis</h1>
          <p>Chaque formulaire envoyé depuis le site arrive ici. {total} demande{total > 1 ? "s" : ""} au total.</p>
        </div>
        <nav className="seg" aria-label="Filtrer par statut">
          <a href="/admin/devis" className={!filter ? "is-on" : undefined}>Toutes ({total})</a>
          {STATUSES.map((k) => (
            <a key={k} href={`/admin/devis?s=${k}`} className={filter === k ? "is-on" : undefined}>
              {LEAD_STATUS[k]} ({countOf(k)})
            </a>
          ))}
        </nav>
      </div>

      {leads.length === 0 ? (
        <div className="panel"><p className="panel__empty">Aucune demande dans cette vue.</p></div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Client</th><th>Demande</th><th>Origine</th><th>Statut</th><th>Suivi</th><th />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <b>{l.name}</b>
                    {l.company && <><br /><span style={{ fontSize: ".8rem" }}>{l.company}</span></>}
                    <br />
                    <a href={`tel:${l.phone}`} style={{ fontSize: ".82rem" }}>{l.phone}</a><br />
                    <a href={`mailto:${l.email}`} style={{ fontSize: ".82rem" }}>{l.email}</a>
                  </td>
                  <td style={{ maxWidth: 320 }}>
                    <b>{l.service}</b><br />
                    <span style={{ fontSize: ".82rem" }}>{l.city}</span>
                    {l.message && <p style={{ marginTop: 8, fontSize: ".82rem", whiteSpace: "pre-wrap" }}>{l.message}</p>}
                  </td>
                  <td style={{ fontSize: ".8rem" }}>
                    {l.utmSource ? <>{l.utmSource}{l.utmCampaign && <><br />{l.utmCampaign}</>}</> : l.referrer || "Direct"}
                    <br /><span className="muted">{dt(l.createdAt)}</span>
                  </td>
                  <td><LeadStatusSelect id={l.id} value={l.status} /></td>
                  <td><LeadNotes id={l.id} notes={l.notes} /></td>
                  <td><DeleteButton id={l.id} kind="lead" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
