"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone } from "./icons";

export function StickyBar({ phone }: { phone: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`sticky-bar${on ? " is-on" : ""}`}>
      <a className="btn btn--ghost" href={`tel:${phone}`} data-evt="tel"><Phone /> Appeler</a>
      <Link className="btn btn--gold" href="/contact">Devis gratuit</Link>
    </div>
  );
}
