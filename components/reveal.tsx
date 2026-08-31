"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Révélations au défilement + compteurs animés, sur les éléments [data-rv] / [data-count]. */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>("[data-rv]:not(.is-in)");

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          const d = parseInt(el.dataset.rv || "0", 10) || 0;
          window.setTimeout(() => el.classList.add("is-in"), d);
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));

    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          cio.unobserve(el);
          const target = parseFloat(el.dataset.count || "0");
          const suffix = el.dataset.suffix || "";
          if (reduce) {
            el.textContent = target + suffix;
            return;
          }
          let t0: number | null = null;
          const tick = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min((ts - t0) / 1500, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cio.observe(el));

    return () => {
      io.disconnect();
      cio.disconnect();
    };
  }, [pathname]);

  return null;
}
