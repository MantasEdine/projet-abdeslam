import type { Row } from "@/lib/analytics";

const PALETTE = ["#c98500", "#3987e5", "#199e70", "#d95926"];

/**
 * Barres horizontales avec libellé et valeur affichés directement :
 * l'identité ne repose jamais sur la seule couleur.
 */
export function HBars({ rows, colorful = false, unit }: { rows: Row[]; colorful?: boolean; unit?: string }) {
  if (rows.length === 0) return <p className="panel__empty">Aucune donnée sur cette période.</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="hbars">
      {rows.map((r, i) => (
        <div className="hbar" key={r.label}>
          <div className="hbar__top">
            <span className="hbar__lbl" title={r.label}>{r.label}</span>
            <span className="hbar__val">
              {r.value.toLocaleString("fr-FR")}{unit ? ` ${unit}` : ""}
            </span>
          </div>
          <div className="hbar__track">
            <div
              className="hbar__fill"
              style={{
                width: `${Math.max((r.value / max) * 100, 2)}%`,
                background: colorful ? PALETTE[i % PALETTE.length] : "#c98500",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
