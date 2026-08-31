"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const VKEY = "regiis_vid";
const SKEY = "regiis_sid";

function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

/** Mesure d'audience first-party : aucun cookie, aucun tiers, identifiants anonymes. */
export function Tracker() {
  const pathname = usePathname();
  const params = useSearchParams();
  const last = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const key = pathname + "?" + params.toString();
    if (last.current === key) return;
    last.current = key;

    let visitorId = "";
    let sessionId = "";
    let isNew = false;
    try {
      visitorId = localStorage.getItem(VKEY) || "";
      if (!visitorId) {
        visitorId = uid();
        localStorage.setItem(VKEY, visitorId);
        isNew = true;
      }
      sessionId = sessionStorage.getItem(SKEY) || "";
      if (!sessionId) {
        sessionId = uid();
        sessionStorage.setItem(SKEY, sessionId);
      }
    } catch {
      // navigation privée / stockage bloqué : on mesure quand même, sans persistance
      visitorId = uid();
      sessionId = visitorId;
      isNew = true;
    }

    const w = window.innerWidth;
    const device = w < 768 ? "mobile" : w < 1100 ? "tablet" : "desktop";

    const body = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      gclid: params.get("gclid"),
      device,
      visitorId,
      sessionId,
      isNew,
    });

    // sendBeacon survit à la navigation ; fetch en repli.
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/track", blob)) throw new Error("beacon refusé");
    } catch {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname, params]);

  return null;
}
