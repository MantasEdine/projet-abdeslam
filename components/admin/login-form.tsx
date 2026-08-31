"use client";
import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <form action={action}>
      {state.error && <div className="notice notice--err" role="alert" style={{ marginBottom: 18 }}>{state.error}</div>}
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">Adresse e-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus placeholder="admin@regiis-security.com" />
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••••" />
      </div>
      <button className="btn btn--gold btn--block" type="submit" disabled={pending} style={{ marginTop: 8 }}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
