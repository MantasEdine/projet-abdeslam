import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/icons";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const next = (await searchParams).next || "/admin";

  return (
    <div className="login">
      <div className="grain" aria-hidden />
      <div className="login__box">
        <div className="logo"><Logo id="lgl" /><span>REGIIS<small>Security</small></span></div>
        <h1>Espace administrateur</h1>
        <p className="login__sub">Connectez-vous pour gérer le site et suivre les demandes.</p>
        <LoginForm next={next.startsWith("/admin") ? next : "/admin"} />
      </div>
    </div>
  );
}
