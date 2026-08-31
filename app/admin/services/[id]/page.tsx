import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ServiceForm } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const service = await db.service.findUnique({ where: { id: (await params).id } });
  if (!service) notFound();

  return (
    <>
      <div className="adm__head">
        <div><h1>{service.title}</h1><p>Modification du service — les changements sont visibles immédiatement.</p></div>
        <div className="adm__actions">
          <Link className="btn btn--ghost btn--sm" href={`/services/${service.slug}`} target="_blank">Voir la page</Link>
        </div>
      </div>
      <ServiceForm init={service} />
    </>
  );
}
