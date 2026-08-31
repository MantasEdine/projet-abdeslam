"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function ContactForm({ services }: { services: string[] }) {
  const params = useSearchParams();
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setState("sending");
    setError("");

    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: String(fd.get("service") || ""),
      city: String(fd.get("city") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
      consent: fd.get("consent") === "on",
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Envoi impossible");
      setState("ok");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Envoi impossible");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate data-rv="80">
      {state === "ok" && (
        <div className="form__ok is-on" role="status">
          Merci, votre demande est bien enregistrée. Nous vous rappelons sous 24 h ouvrées.
        </div>
      )}
      {state === "error" && (
        <div className="notice notice--err" role="alert" style={{ marginBottom: 18 }}>{error}</div>
      )}

      <h2 className="h-s" style={{ marginBottom: 22 }}>Demande de devis</h2>

      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Nom et prénom *</label>
          <input id="name" name="name" type="text" autoComplete="name" required placeholder="Jean Dupont" />
        </div>
        <div className="field">
          <label htmlFor="company">Société</label>
          <input id="company" name="company" type="text" autoComplete="organization" placeholder="Nom de l'entreprise" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="email">E-mail *</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="jean@exemple.fr" />
        </div>
        <div className="field">
          <label htmlFor="phone">Téléphone *</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required placeholder="06 00 00 00 00" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="service">Service souhaité *</label>
        <select id="service" name="service" required defaultValue="">
          <option value="" disabled>Sélectionnez…</option>
          {services.map((s) => <option key={s}>{s}</option>)}
          <option>Plusieurs services / je ne sais pas encore</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="city">Commune du site à protéger *</label>
        <input id="city" name="city" type="text" required placeholder="Senlis (60300)" />
      </div>

      <div className="field">
        <label htmlFor="message">Votre besoin</label>
        <textarea id="message" name="message" placeholder="Type de site, surface, horaires souhaités, nombre de passages par nuit envisagé…" />
      </div>

      {/* pot de miel anti-spam — invisible pour les humains */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          J&apos;accepte que ces informations soient utilisées pour être recontacté au sujet de ma
          demande. Elles ne sont ni revendues, ni transmises à des tiers.
        </span>
      </label>

      <button className="btn btn--gold btn--block" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Envoi…" : "Envoyer ma demande"}
      </button>
      <p className="form__note">Réponse sous 24 h ouvrées · Devis gratuit et sans engagement</p>
    </form>
  );
}
