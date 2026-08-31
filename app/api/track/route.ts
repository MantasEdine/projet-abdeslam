import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(500).nullable().optional(),
  utmSource: z.string().max(120).nullable().optional(),
  utmMedium: z.string().max(120).nullable().optional(),
  utmCampaign: z.string().max(160).nullable().optional(),
  gclid: z.string().max(200).nullable().optional(),
  device: z.enum(["mobile", "tablet", "desktop"]).default("desktop"),
  visitorId: z.string().min(4).max(80),
  sessionId: z.string().min(4).max(80),
  isNew: z.boolean().default(false),
});

/** Ne garde que le domaine du référent, jamais l'URL complète. */
function host(ref?: string | null) {
  if (!ref) return null;
  try {
    const h = new URL(ref).hostname.replace(/^www\./, "");
    return h || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const d = parsed.data;

    const self = req.nextUrl.hostname.replace(/^www\./, "");
    const ref = host(d.referrer);

    await db.pageview.create({
      data: {
        path: d.path.slice(0, 300),
        referrer: ref && ref !== self ? ref : null,
        // un clic Google Ads porte gclid même sans utm_source explicite
        utmSource: d.utmSource || (d.gclid ? "google" : null),
        utmMedium: d.utmMedium || (d.gclid ? "cpc" : null),
        utmCampaign: d.utmCampaign || null,
        device: d.device,
        country: req.headers.get("x-vercel-ip-country") || null,
        visitorId: d.visitorId,
        sessionId: d.sessionId,
        isNew: d.isNew,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    // la mesure d'audience ne doit jamais casser une page
    return new NextResponse(null, { status: 204 });
  }
}
