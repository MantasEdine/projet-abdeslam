"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Phone } from "./icons";

type Nav = { href: string; label: string };

export function SiteHeader({ nav, phone, phoneDisplay }: { nav: Nav[]; phone: string; phoneDisplay: string }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className={`hdr${stuck ? " is-stuck" : ""}`}>
        <div className="wrap hdr__in">
          <Link className="logo" href="/" aria-label="Regiis Security — accueil">
            <Logo />
            <span>REGIIS<small>Security</small></span>
          </Link>

          <nav className="nav" aria-label="Navigation principale">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hdr__cta">
            <a className="tel-link" href={`tel:${phone}`} data-evt="tel"><Phone /> {phoneDisplay}</a>
            <Link className="btn btn--gold btn--sm" href="/contact">Devis gratuit</Link>
          </div>

          <button
            className="burger"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <div className={`mnav${open ? " is-open" : ""}`} id="mnav">
        {nav.map((n) => (
          <Link key={n.href} href={n.href}>{n.label}</Link>
        ))}
        <Link className="btn btn--gold" href="/contact">Demander un devis</Link>
      </div>
    </>
  );
}
