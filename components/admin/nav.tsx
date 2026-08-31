"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ico = (d: string) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const LINKS = [
  { href: "/admin", label: "Tableau de bord", d: "M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 9h8V3h-8z", group: "Pilotage" },
  { href: "/admin/devis", label: "Demandes de devis", d: "M4 4h16v12H7l-3 3z", group: "Pilotage" },
  { href: "/admin/services", label: "Services", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", group: "Contenu" },
  { href: "/admin/articles", label: "Articles", d: "M4 4h13l3 3v13H4z M8 9h8M8 13h8M8 17h5", group: "Contenu" },
  { href: "/admin/medias", label: "Médias", d: "M3 5h18v14H3z M3 15l5-5 4 4 3-3 6 6", group: "Contenu" },
  { href: "/admin/admins", label: "Administrateurs", d: "M16 20v-2a4 4 0 0 0-8 0v2 M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7", group: "Réglages" },
  { href: "/admin/reglages", label: "Coordonnées", d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z", group: "Réglages" },
];

export function AdminNav({ role }: { role: "OWNER" | "EDITOR" }) {
  const pathname = usePathname();
  const visible = LINKS.filter((l) => role === "OWNER" || !["/admin/admins", "/admin/reglages"].includes(l.href));
  const groups = [...new Set(visible.map((l) => l.group))];

  const on = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      {groups.map((g) => (
        <div key={g}>
          <div className="adm__sep">{g}</div>
          <div className="adm__nav">
            {visible.filter((l) => l.group === g).map((l) => (
              <Link key={l.href} href={l.href} className={on(l.href) ? "is-on" : undefined}>
                {ico(l.d)} {l.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
