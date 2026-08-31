"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import {
  saveService, saveArticle, saveAdmin, saveSettings, saveLeadNotes,
  setLeadStatus, deleteLead, deleteService, deleteArticle, deleteAdmin,
  type FormState,
} from "@/app/admin/actions";

const empty: FormState = {};

function Alerts({ state }: { state: FormState }) {
  return (
    <>
      {state.error && <div className="notice notice--err" role="alert">{state.error}</div>}
      {state.ok && <div className="notice notice--ok" role="status">{state.ok}</div>}
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <small style={{ color: "var(--muted)", fontSize: ".76rem" }}>{hint}</small>}
    </div>
  );
}

/** Bouton de suppression avec confirmation explicite. */
export function DeleteButton({ id, kind, label = "Supprimer" }: { id: string; kind: "service" | "article" | "admin" | "lead"; label?: string }) {
  const [busy, setBusy] = useState(false);
  const fns = { service: deleteService, article: deleteArticle, admin: deleteAdmin, lead: deleteLead };
  const words = {
    service: "Supprimer ce service ? Il disparaîtra du site et du menu.",
    article: "Supprimer cet article ? Cette action est définitive.",
    admin: "Supprimer cet administrateur ? Il perdra tout accès.",
    lead: "Supprimer cette demande ? Cette action est définitive.",
  };
  return (
    <button
      className="btn btn--danger btn--xs"
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!confirm(words[kind])) return;
        setBusy(true);
        try {
          await fns[kind](id);
        } catch (e) {
          alert(e instanceof Error ? e.message : "Suppression impossible");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "…" : label}
    </button>
  );
}

/* ---------------------------------------------------------------- services */

type ServiceInit = {
  id?: string; slug?: string; title?: string; navLabel?: string; tagline?: string; excerpt?: string;
  heroImage?: string; cardImage?: string; intro?: string; bodyTitle?: string; bodyHtml?: string;
  features?: string[]; formulas?: unknown; faqs?: unknown; ctaTitle?: string; ctaText?: string;
  metaTitle?: string; metaDesc?: string; position?: number; published?: boolean;
};

export function ServiceForm({ init = {} }: { init?: ServiceInit }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveService, empty);
  const j = (v: unknown) => JSON.stringify(v ?? [], null, 2);

  return (
    <form action={action} className="adm-form">
      <Alerts state={state} />
      {init.id && <input type="hidden" name="id" value={init.id} />}

      <div className="card-form">
        <h2>Identité</h2>
        <div className="field-row">
          <Field label="Titre *"><input name="title" defaultValue={init.title} required maxLength={120} /></Field>
          <Field label="Slug (URL) *" hint="Adresse de la page : /services/<slug>">
            <input name="slug" defaultValue={init.slug} required pattern="[a-z0-9-]+" />
          </Field>
        </div>
        <div className="field-row">
          <Field label="Libellé du menu" hint="Version courte pour la navigation. Ex. « Rondes »">
            <input name="navLabel" defaultValue={init.navLabel} maxLength={28} />
          </Field>
          <Field label="Étiquette" hint="Ex. « 01 — Présence »"><input name="tagline" defaultValue={init.tagline} maxLength={60} /></Field>
        </div>
        <div className="field-row">
          <Field label="Ordre d'affichage"><input name="position" type="number" min={0} defaultValue={init.position ?? 0} /></Field>
          <div />
        </div>
        <Field label="Accroche (carte d'accueil) *">
          <textarea name="excerpt" defaultValue={init.excerpt} required style={{ minHeight: 90 }} />
        </Field>
        <label className="consent" style={{ marginBottom: 0 }}>
          <input type="checkbox" name="published" defaultChecked={init.published ?? true} />
          <span>Publié — visible sur le site et dans le menu</span>
        </label>
      </div>

      <div className="card-form">
        <h2>Images</h2>
        <div className="field-row">
          <Field label="Image de bannière *" hint="Chemin depuis /public, ex. /assets/img/rondes-wide.jpg">
            <input name="heroImage" defaultValue={init.heroImage} required />
          </Field>
          <Field label="Image de carte *" hint="Format paysage, idéalement 720×495">
            <input name="cardImage" defaultValue={init.cardImage} required />
          </Field>
        </div>
      </div>

      <div className="card-form">
        <h2>Contenu de la page</h2>
        <Field label="Introduction (sous le titre) *">
          <textarea name="intro" defaultValue={init.intro} required style={{ minHeight: 90 }} />
        </Field>
        <Field label="Titre du bloc principal *"><input name="bodyTitle" defaultValue={init.bodyTitle} required /></Field>
        <Field label="Corps du texte (HTML)" hint="Balises autorisées : <p>, <h3>, <strong>, <em>, <ul>, <li>">
          <textarea name="bodyHtml" defaultValue={init.bodyHtml} className="tall" />
        </Field>
        <Field label="Prestations incluses" hint="Une par ligne">
          <textarea name="features" defaultValue={(init.features ?? []).join("\n")} style={{ minHeight: 150 }} />
        </Field>
      </div>

      <div className="card-form">
        <h2>Formules et questions fréquentes</h2>
        <Field label="Formules (JSON)" hint={'Tableau d\'objets : [{"label":"ESSENTIEL","title":"2 passages / nuit","text":"…"}]'}>
          <textarea name="formulas" defaultValue={j(init.formulas)} style={{ minHeight: 190 }} />
        </Field>
        <Field label="FAQ (JSON)" hint={'Tableau d\'objets : [{"q":"Question ?","a":"Réponse."}]'}>
          <textarea name="faqs" defaultValue={j(init.faqs)} style={{ minHeight: 190 }} />
        </Field>
      </div>

      <div className="card-form">
        <h2>Appel à l&apos;action et référencement</h2>
        <Field label="Titre de l'encart final *"><input name="ctaTitle" defaultValue={init.ctaTitle} required /></Field>
        <Field label="Texte de l'encart final *"><textarea name="ctaText" defaultValue={init.ctaText} required style={{ minHeight: 80 }} /></Field>
        <Field label="Titre SEO *" hint="Affiché dans l'onglet du navigateur et sur Google">
          <input name="metaTitle" defaultValue={init.metaTitle} required maxLength={200} />
        </Field>
        <Field label="Description SEO *" hint="150 à 160 caractères recommandés">
          <textarea name="metaDesc" defaultValue={init.metaDesc} required style={{ minHeight: 80 }} maxLength={400} />
        </Field>
      </div>

      <div className="row-actions">
        <button className="btn btn--gold" type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link className="btn btn--ghost" href="/admin/services">Annuler</Link>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- articles */

type ArticleInit = {
  id?: string; slug?: string; title?: string; excerpt?: string; coverImage?: string;
  contentHtml?: string; tags?: string[]; readMinutes?: number; published?: boolean;
  metaTitle?: string | null; metaDesc?: string | null;
};

export function ArticleForm({ init = {} }: { init?: ArticleInit }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveArticle, empty);

  return (
    <form action={action} className="adm-form">
      <Alerts state={state} />
      {init.id && <input type="hidden" name="id" value={init.id} />}

      <div className="card-form">
        <h2>L&apos;article</h2>
        <Field label="Titre *"><input name="title" defaultValue={init.title} required maxLength={200} /></Field>
        <div className="field-row">
          <Field label="Slug (URL) *" hint="/articles/<slug>">
            <input name="slug" defaultValue={init.slug} required pattern="[a-z0-9-]+" />
          </Field>
          <Field label="Temps de lecture (min)">
            <input name="readMinutes" type="number" min={1} max={60} defaultValue={init.readMinutes ?? 4} />
          </Field>
        </div>
        <Field label="Chapô *" hint="Résumé affiché sur les cartes et dans les résultats Google">
          <textarea name="excerpt" defaultValue={init.excerpt} required style={{ minHeight: 90 }} />
        </Field>
        <div className="field-row">
          <Field label="Image de couverture *" hint="Ex. /assets/img/rondes.jpg">
            <input name="coverImage" defaultValue={init.coverImage} required />
          </Field>
          <Field label="Étiquettes" hint="Séparées par des virgules">
            <input name="tags" defaultValue={(init.tags ?? []).join(", ")} />
          </Field>
        </div>
        <label className="consent" style={{ marginBottom: 0 }}>
          <input type="checkbox" name="published" defaultChecked={init.published ?? false} />
          <span>Publié — visible sur le site</span>
        </label>
      </div>

      <div className="card-form">
        <h2>Contenu (HTML)</h2>
        <Field label="Corps de l'article *" hint="Balises : <p>, <h2>, <h3>, <strong>, <ul>/<ol> + <li>, <blockquote>">
          <textarea name="contentHtml" defaultValue={init.contentHtml} required className="tall" style={{ minHeight: 460 }} />
        </Field>
      </div>

      <div className="card-form">
        <h2>Référencement</h2>
        <Field label="Titre SEO" hint="Laissez vide pour reprendre le titre de l'article">
          <input name="metaTitle" defaultValue={init.metaTitle ?? ""} maxLength={200} />
        </Field>
        <Field label="Description SEO" hint="Laissez vide pour reprendre le chapô">
          <textarea name="metaDesc" defaultValue={init.metaDesc ?? ""} style={{ minHeight: 80 }} maxLength={400} />
        </Field>
      </div>

      <div className="row-actions">
        <button className="btn btn--gold" type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link className="btn btn--ghost" href="/admin/articles">Annuler</Link>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ admins */

export function AdminForm({
  init = {},
  isSelf = false,
}: {
  init?: { id?: string; email?: string; name?: string; role?: "OWNER" | "EDITOR"; active?: boolean };
  isSelf?: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveAdmin, empty);

  return (
    <form action={action} className="card-form" style={{ display: "grid", gap: 14 }}>
      <Alerts state={state} />
      {init.id && <input type="hidden" name="id" value={init.id} />}
      <div className="field-row">
        <Field label="Nom *"><input name="name" defaultValue={init.name} required /></Field>
        <Field label="E-mail *"><input name="email" type="email" defaultValue={init.email} required /></Field>
      </div>
      <div className="field-row">
        <Field label="Rôle" hint="Propriétaire : accès complet. Éditeur : contenu uniquement.">
          <select name="role" defaultValue={init.role ?? "EDITOR"} disabled={isSelf}>
            <option value="EDITOR">Éditeur</option>
            <option value="OWNER">Propriétaire</option>
          </select>
          {isSelf && <input type="hidden" name="role" value={init.role ?? "OWNER"} />}
        </Field>
        <Field label={init.id ? "Nouveau mot de passe" : "Mot de passe *"} hint="10 caractères minimum">
          <input name="password" type="password" autoComplete="new-password" minLength={10} required={!init.id} placeholder={init.id ? "Laisser vide pour ne pas changer" : ""} />
        </Field>
      </div>
      <label className="consent" style={{ marginBottom: 0 }}>
        <input type="checkbox" name="active" defaultChecked={init.active ?? true} disabled={isSelf} />
        <span>Compte actif{isSelf ? " (vous ne pouvez pas vous désactiver)" : ""}</span>
      </label>
      {isSelf && <input type="hidden" name="active" value="on" />}
      <div className="row-actions">
        <button className="btn btn--gold" type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : init.id ? "Mettre à jour" : "Créer l'administrateur"}
        </button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- réglages */

export function SettingsForm({ init }: { init: { phone: string; phoneDisplay: string; whatsapp: string; email: string } }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, empty);
  return (
    <form action={action} className="card-form" style={{ display: "grid", gap: 14, maxWidth: 720 }}>
      <Alerts state={state} />
      <div className="field-row">
        <Field label="Téléphone (format international) *" hint="Utilisé par les liens « Appeler ». Ex. +33652920387">
          <input name="phone" defaultValue={init.phone} required />
        </Field>
        <Field label="Téléphone affiché *" hint="Ex. 06 52 92 03 87">
          <input name="phoneDisplay" defaultValue={init.phoneDisplay} required />
        </Field>
      </div>
      <div className="field-row">
        <Field label="Numéro WhatsApp *" hint="Chiffres uniquement, indicatif compris. Ex. 33652920387">
          <input name="whatsapp" defaultValue={init.whatsapp} required />
        </Field>
        <Field label="E-mail de contact *"><input name="email" type="email" defaultValue={init.email} required /></Field>
      </div>
      <div className="row-actions">
        <button className="btn btn--gold" type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------- leads */

export const LEAD_STATUS: Record<string, string> = {
  NEW: "Nouveau", CONTACTED: "Contacté", QUOTED: "Devis envoyé", WON: "Gagné", LOST: "Perdu",
};

export function LeadStatusSelect({ id, value }: { id: string; value: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <select
      defaultValue={value}
      disabled={busy}
      aria-label="Statut de la demande"
      style={{ padding: "7px 12px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--line-2)", fontSize: ".82rem" }}
      onChange={async (e) => {
        setBusy(true);
        await setLeadStatus(id, e.target.value as "NEW").catch(() => {});
        setBusy(false);
      }}
    >
      {Object.entries(LEAD_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    </select>
  );
}

export function LeadNotes({ id, notes }: { id: string; notes: string | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveLeadNotes, empty);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button className="btn btn--ghost btn--xs" type="button" onClick={() => setOpen(true)}>
        {notes ? "Voir la note" : "Ajouter une note"}
      </button>
    );
  }
  return (
    <form action={action} style={{ display: "grid", gap: 8, minWidth: 260 }}>
      <input type="hidden" name="id" value={id} />
      <textarea name="notes" defaultValue={notes ?? ""} placeholder="Suivi commercial, rappel prévu…"
        style={{ minHeight: 90, padding: 11, borderRadius: 10, background: "var(--bg)", border: "1px solid var(--line-2)", fontSize: ".82rem" }} />
      {state.ok && <span style={{ color: "#8DEBC8", fontSize: ".78rem" }}>{state.ok}</span>}
      <div className="row-actions">
        <button className="btn btn--gold btn--xs" type="submit" disabled={pending}>Enregistrer</button>
        <button className="btn btn--ghost btn--xs" type="button" onClick={() => setOpen(false)}>Fermer</button>
      </div>
    </form>
  );
}
