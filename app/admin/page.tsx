import Link from "next/link";
import { getSummary, getDailySeries, getTopPages, getSources, getDevices, getCampaigns, resolveRange, RANGES } from "@/lib/analytics";
import { db } from "@/lib/db";
import { TrafficChart, LeadsChart } from "@/components/admin/charts";
import { HBars } from "@/components/admin/bars";

export const dynamic = "force-dynamic";

function Kpi({ label, value, delta, sub }: { label: string; value: string; delta?: number; sub?: string }) {
  return (
    <div className="kpi">
      <div className="kpi__lbl">{label}</div>
      <div className="kpi__val">{value}</div>
      <div className="kpi__sub">
        {typeof delta === "number" && (
          <span className={`trend trend--${delta >= 0 ? "up" : "down"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} %
          </span>
        )}
        <span>{sub}</span>
      </div>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const r = resolveRange((await searchParams).r);
  const [summary, series, pages, sources, devices, campaigns, recent] = await Promise.all([
    getSummary(r.from, r.to, r.prevFrom),
    getDailySeries(r.from, r.to),
    getTopPages(r.from, r.to),
    getSources(r.from, r.to),
    getDevices(r.from, r.to),
    getCampaigns(r.from, r.to),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const nf = (n: number) => n.toLocaleString("fr-FR");
  const hasData = summary.pageviews > 0;

  return (
    <div className="viz">
      <div className="adm__head">
        <div>
          <h1>Tableau de bord</h1>
          <p>Audience du site et demandes de devis sur les {r.label.toLowerCase()} écoulés.</p>
        </div>
        <nav className="seg" aria-label="Période">
          {RANGES.map((x) => (
            <Link key={x.key} href={`/admin?r=${x.key}`} className={x.key === r.key ? "is-on" : undefined}>
              {x.label}
            </Link>
          ))}
        </nav>
      </div>

      {!hasData && (
        <div className="notice notice--ok" style={{ marginBottom: 20 }}>
          Aucune visite enregistrée sur cette période. Les statistiques se remplissent
          automatiquement dès que le site reçoit du trafic — idéal pour suivre vos campagnes
          publicitaires dès le premier clic.
        </div>
      )}

      <div className="kpis">
        <Kpi label="Visiteurs uniques" value={nf(summary.visitors)} delta={summary.visitorsDelta} sub="vs période précédente" />
        <Kpi label="Pages vues" value={nf(summary.pageviews)} delta={summary.pageviewsDelta} sub={`${summary.pagesPerSession} pages / session`} />
        <Kpi label="Demandes de devis" value={nf(summary.leads)} delta={summary.leadsDelta} sub="formulaire de contact" />
        <Kpi label="Taux de conversion" value={`${summary.conversion} %`} sub="visiteurs → demandes" />
      </div>

      <div className="panels" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel__hd"><h3>Trafic</h3></div>
          <p className="panel__sub">Visiteurs uniques et pages vues, jour par jour.</p>
          <TrafficChart data={series} />
        </div>
      </div>

      <div className="panels panels--2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel__hd"><h3>Demandes de devis</h3></div>
          <p className="panel__sub">Formulaires reçus par jour.</p>
          <LeadsChart data={series} />
        </div>
        <div className="panel">
          <div className="panel__hd"><h3>Origine du trafic</h3></div>
          <p className="panel__sub">Visiteurs uniques par source — campagnes, référents ou accès direct.</p>
          <HBars rows={sources} colorful />
        </div>
      </div>

      <div className="panels panels--2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel__hd"><h3>Pages les plus vues</h3></div>
          <p className="panel__sub">Nombre de vues sur la période.</p>
          <HBars rows={pages} />
        </div>
        <div className="panel">
          <div className="panel__hd"><h3>Appareils</h3></div>
          <p className="panel__sub">Répartition des visiteurs uniques.</p>
          <HBars rows={devices} colorful />
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel__hd"><h3>Performance des campagnes</h3></div>
        <p className="panel__sub">
          Visites arrivées avec un paramètre <code>utm_source</code> ou un clic Google Ads.
          Balisez vos annonces avec <code>?utm_source=google&amp;utm_medium=cpc&amp;utm_campaign=nom</code>.
        </p>
        {campaigns.length === 0 ? (
          <p className="panel__empty">Aucune visite issue d&apos;une campagne balisée sur cette période.</p>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Campagne</th><th>Source</th>
                  <th className="num">Visiteurs</th><th className="num">Demandes</th><th className="num">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.campaign + c.source}>
                    <td><b>{c.campaign}</b></td>
                    <td>{c.source}</td>
                    <td className="num">{nf(c.visitors)}</td>
                    <td className="num">{nf(c.leads)}</td>
                    <td className="num"><b>{c.cvr} %</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel__hd">
          <h3>Dernières demandes</h3>
          <Link className="link-arrow" href="/admin/devis">Tout voir</Link>
        </div>
        <p className="panel__sub">Les cinq formulaires les plus récents.</p>
        {recent.length === 0 ? (
          <p className="panel__empty">Aucune demande pour le moment.</p>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th>Client</th><th>Service</th><th>Commune</th><th>Statut</th><th>Reçue le</th></tr>
              </thead>
              <tbody>
                {recent.map((l) => (
                  <tr key={l.id}>
                    <td><b>{l.name}</b><br /><span style={{ fontSize: ".8rem" }}>{l.phone}</span></td>
                    <td>{l.service}</td>
                    <td>{l.city}</td>
                    <td><span className={`badge badge--${l.status}`}>{l.status}</span></td>
                    <td>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
