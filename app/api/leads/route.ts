import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifyNewLead } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail invalide").max(180),
  phone: z.string().trim().min(6, "Téléphone invalide").max(40),
  service: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2, "Commune requise").max(120),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
  // pot de miel anti-spam : doit rester vide
  website: z.string().max(0).optional().or(z.literal("")),
  utmSource: z.string().max(120).nullish(),
  utmMedium: z.string().max(120).nullish(),
  utmCampaign: z.string().max(160).nullish(),
  referrer: z.string().max(300).nullish(),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Formulaire invalide" },
      { status: 400 }
    );
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // spam silencieux

  try {
    const lead = await db.lead.create({
      data: {
        name: d.name, company: d.company || null, email: d.email.toLowerCase(),
        phone: d.phone, service: d.service, city: d.city, message: d.message || null,
        utmSource: d.utmSource || null, utmMedium: d.utmMedium || null,
        utmCampaign: d.utmCampaign || null, referrer: d.referrer || null,
      },
    });
    await notifyNewLead(lead);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur, réessayez." }, { status: 500 });
  }
}
