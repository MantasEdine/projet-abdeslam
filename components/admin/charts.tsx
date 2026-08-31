"use client";
import {
  Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import type { DayPoint } from "@/lib/analytics";

/* Jetons validés (voir README § Dashboard) — ambre, bleu, aqua, orange. */
const C = { s1: "#c98500", s2: "#3987e5", s3: "#199e70", grid: "rgba(255,255,255,.07)", text: "#8E96A1" };

const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(iso + "T00:00:00Z"));

const fmtFull = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(iso + "T00:00:00Z")
  );

type TipEntry = { name?: string; value?: number | string; color?: string; dataKey?: string | number };

function Tip({ active, payload, label }: { active?: boolean; payload?: TipEntry[]; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="viz-tip">
      <div className="viz-tip__t">{fmtFull(label)}</div>
      {payload.map((p) => (
        <div className="viz-tip__r" key={String(p.dataKey)}>
          <span className="viz-tip__k">
            <i className="viz-tip__sw" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="viz-tip__v">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

const axis = {
  stroke: "transparent",
  tick: { fill: C.text, fontSize: 11 },
  tickLine: false,
  axisLine: false,
};

/** Trafic : deux séries de même nature (comptages) sur un axe unique. */
export function TrafficChart({ data }: { data: DayPoint[] }) {
  const step = Math.max(1, Math.ceil(data.length / 8));
  return (
    <>
      <div className="legend">
        <span><i style={{ background: C.s1 }} /> Visiteurs uniques</span>
        <span><i style={{ background: C.s2 }} /> Pages vues</span>
      </div>
      <ResponsiveContainer width="100%" height={286}>
        <ComposedChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.s1} stopOpacity={0.35} />
              <stop offset="100%" stopColor={C.s1} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="date" {...axis} interval={step - 1} tickFormatter={fmtDay} />
          <YAxis {...axis} width={46} allowDecimals={false} />
          <Tooltip content={<Tip />} cursor={{ stroke: "rgba(255,255,255,.22)", strokeWidth: 1 }} />
          <Area
            type="monotone" dataKey="visiteurs" name="Visiteurs uniques"
            stroke={C.s1} strokeWidth={2} fill="url(#gv)"
            dot={false} activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#0F1114" }}
          />
          <Line
            type="monotone" dataKey="pages" name="Pages vues"
            stroke={C.s2} strokeWidth={2} dot={false}
            activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#0F1114" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}

/** Demandes de devis : série unique — pas de légende, le titre nomme la série. */
export function LeadsChart({ data }: { data: DayPoint[] }) {
  const step = Math.max(1, Math.ceil(data.length / 6));
  return (
    <ResponsiveContainer width="100%" height={216}>
      <BarChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -22 }} barCategoryGap="14%">
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="date" {...axis} interval={step - 1} tickFormatter={fmtDay} />
        <YAxis {...axis} width={40} allowDecimals={false} />
        <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,.05)" }} />
        <Bar dataKey="demandes" name="Demandes de devis" fill={C.s3} radius={[4, 4, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
