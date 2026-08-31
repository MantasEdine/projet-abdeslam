import { ServiceForm } from "@/components/admin/forms";
export const dynamic = "force-dynamic";

export default function NewServicePage() {
  return (
    <>
      <div className="adm__head">
        <div><h1>Nouveau service</h1><p>Il apparaîtra sur l&apos;accueil, dans le menu et dans le pied de page.</p></div>
      </div>
      <ServiceForm init={{ heroImage: "/assets/img/hero.jpg", cardImage: "/assets/img/svc-gardiennage.jpg", position: 4 }} />
    </>
  );
}
