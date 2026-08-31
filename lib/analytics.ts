import "server-only";
import { db } from "./db";

export type RangeKey = "7d" | "30d" | "90d" | "12m";

export const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: "7d", label: "7 jours", days: 7 },
  { key: "30d", label: "30 jours", days: 30 },
  { key: "90d", label: "90 jours", days: 90 },
  { key: "12m", label: "12 mois", days: 365 },
];

export function resolveRange(key?: string) {
  const r = RANGES.find((x) => x.key === key) ?? RANGES[1];
  const to = new Date();
  const from = new Date(to.getTime() - r.days * 864e5);
  const prevFrom = new Date(from.getTime() - r.days * 864e5);
  return { ...r, from, to, prevFrom };
}

const pct = (now: number, before: number) =>
  before === 0 ? (now > 0 ? 100 : 0) : Math.round(((now - before) / before) * 100);

export type Summary = {
  visitors: number; visitorsDelta: number;
  pageviews: number; pageviewsDelta: number;
  sessions: number; sessionsDelta: number;
  leads: number; leadsDelta: number;
  conversion: number;
  pagesPerSession: number;
};

async function counts(from: Date, to: Date) {
  const [pageviews, visitors, sessions, leads] = await Promise.all([
    db.pageview.count({ where: { createdAt: { gte: from, lt: to } } }),
    db.pageview.findMany({
      where: { createdAt: { gte: from, lt: to } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    }),
    db.pageview.findMany({
      where: { createdAt: { gte: from, lt: to } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
    db.lead.count({ where: { createdAt: { gte: from, lt: to } } }),
  ]);
  return { pageviews, visitors: visitors.length, sessions: sessions.length, leads };
}

export async function getSummary(from: Date, to: Date, prevFrom: Date): Promise<Summary> {
  const [now, before] = await Promise.all([counts(from, to), counts(prevFrom, from)]);
  return {
    visitors: now.visitors, visitorsDelta: pct(now.visitors, before.visitors),
    pageviews: now.pageviews, pageviewsDelta: pct(now.pageviews, before.pageviews),
    sessions: now.sessions, sessionsDelta: pct(now.sessions, before.sessions),
    leads: now.leads, leadsDelta: pct(now.leads, before.leads),
    conversion: now.visitors ? Math.round((now.leads / now.visitors) * 1000) / 10 : 0,
    pagesPerSession: now.sessions ? Math.round((now.pageviews / now.sessions) * 10) / 10 : 0,
  };
}

export type DayPoint = { date: string; visiteurs: number; pages: number; demandes: number };

/** Série quotidienne complète — les jours sans trafic sont renvoyés à zéro. */
export async function getDailySeries(from: Date, to: Date): Promise<DayPoint[]> {
  const [views, leads] = await Promise.all([
    db.$queryRaw<{ d: Date; visiteurs: bigint; pages: bigint }[]>`
      SELECT date_trunc('day', "createdAt") AS d,
             COUNT(DISTINCT "visitorId")    AS visiteurs,
             COUNT(*)                       AS pages
      FROM "Pageview"
      WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
      GROUP BY 1 ORDER BY 1`,
    db.$queryRaw<{ d: Date; n: bigint }[]>`
      SELECT date_trunc('day', "createdAt") AS d, COUNT(*) AS n
      FROM "Lead"
      WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
      GROUP BY 1 ORDER BY 1`,
  ]);

  const key = (d: Date) => d.toISOString().slice(0, 10);
  const vMap = new Map(views.map((r) => [key(r.d), r]));
  const lMap = new Map(leads.map((r) => [key(r.d), Number(r.n)]));

  const out: DayPoint[] = [];
  const cur = new Date(from);
  cur.setUTCHours(0, 0, 0, 0);
  while (cur < to) {
    const k = key(cur);
    const v = vMap.get(k);
    out.push({
      date: k,
      visiteurs: v ? Number(v.visiteurs) : 0,
      pages: v ? Number(v.pages) : 0,
      demandes: lMap.get(k) ?? 0,
    });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

export type Row = { label: string; value: number };

export async function getTopPages(from: Date, to: Date, take = 8): Promise<Row[]> {
  const rows = await db.pageview.groupBy({
    by: ["path"],
    where: { createdAt: { gte: from, lt: to } },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take,
  });
  return rows.map((r) => ({ label: r.path, value: r._count.path }));
}

/** Regroupe le trafic par origine : campagnes payantes, référents, ou accès direct. */
export async function getSources(from: Date, to: Date, take = 8): Promise<Row[]> {
  const rows = await db.$queryRaw<{ label: string; n: bigint }[]>`
    SELECT COALESCE(NULLIF("utmSource", ''), NULLIF("referrer", ''), 'Direct') AS label,
           COUNT(DISTINCT "visitorId") AS n
    FROM "Pageview"
    WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
    GROUP BY 1 ORDER BY n DESC LIMIT ${take}`;
  return rows.map((r) => ({ label: r.label, value: Number(r.n) }));
}

export async function getDevices(from: Date, to: Date): Promise<Row[]> {
  const rows = await db.$queryRaw<{ label: string; n: bigint }[]>`
    SELECT "device" AS label, COUNT(DISTINCT "visitorId") AS n
    FROM "Pageview"
    WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
    GROUP BY 1 ORDER BY n DESC`;
  const fr: Record<string, string> = { desktop: "Ordinateur", mobile: "Mobile", tablet: "Tablette" };
  return rows.map((r) => ({ label: fr[r.label] ?? r.label, value: Number(r.n) }));
}

export type Campaign = { campaign: string; source: string; visitors: number; leads: number; cvr: number };

/** Performance par campagne publicitaire : visiteurs, demandes de devis et taux de conversion. */
export async function getCampaigns(from: Date, to: Date, take = 10): Promise<Campaign[]> {
  const visits = await db.$queryRaw<{ campaign: string; source: string; n: bigint }[]>`
    SELECT COALESCE(NULLIF("utmCampaign", ''), '(sans campagne)') AS campaign,
           COALESCE(NULLIF("utmSource", ''), '—')                 AS source,
           COUNT(DISTINCT "visitorId")                            AS n
    FROM "Pageview"
    WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "utmSource" IS NOT NULL
    GROUP BY 1, 2 ORDER BY n DESC LIMIT ${take}`;

  const leads = await db.$queryRaw<{ campaign: string; n: bigint }[]>`
    SELECT COALESCE(NULLIF("utmCampaign", ''), '(sans campagne)') AS campaign, COUNT(*) AS n
    FROM "Lead"
    WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "utmSource" IS NOT NULL
    GROUP BY 1`;
  const lMap = new Map(leads.map((r) => [r.campaign, Number(r.n)]));

  return visits.map((v) => {
    const visitors = Number(v.n);
    const l = lMap.get(v.campaign) ?? 0;
    return {
      campaign: v.campaign, source: v.source, visitors, leads: l,
      cvr: visitors ? Math.round((l / visitors) * 1000) / 10 : 0,
    };
  });
}
