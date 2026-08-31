/**
 * OPTIONNEL — remplit la base de statistiques de démonstration pour visualiser
 * le tableau de bord avant la mise en ligne.
 *   npx tsx --env-file=.env prisma/demo-analytics.ts
 * Pour tout effacer ensuite :
 *   npx tsx --env-file=.env prisma/demo-analytics.ts --reset
 */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const PATHS = ["/", "/services/rondes", "/services/gardiennage", "/services/alarmes", "/contact", "/articles", "/articles/rondes-horaires-aleatoires-pourquoi", "/articles/vols-sur-chantier-btp-comment-repondre"];
const SOURCES: [string | null, string | null, string | null, string | null][] = [
  ["google", "cpc", "rondes-oise", null],
  ["google", "cpc", "gardiennage-senlis", null],
  ["facebook", "paid_social", "chantiers-btp", null],
  [null, null, null, "google.com"],
  [null, null, null, "pagesjaunes.fr"],
  [null, null, null, null],
];
const DEVICES = ["mobile", "mobile", "mobile", "desktop", "desktop", "tablet"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

async function main() {
  if (process.argv.includes("--reset")) {
    await db.pageview.deleteMany({});
    console.log("✔ Statistiques effacées");
    return;
  }

  const DAYS = 90;
  const views: {
    path: string; referrer: string | null; utmSource: string | null; utmMedium: string | null;
    utmCampaign: string | null; device: string; visitorId: string; sessionId: string;
    isNew: boolean; createdAt: Date;
  }[] = [];
  const visitors: string[] = [];

  for (let d = DAYS; d >= 0; d--) {
    const day = new Date(Date.now() - d * 864e5);
    const weekend = [0, 6].includes(day.getDay());
    // tendance croissante + creux le week-end
    const base = 14 + Math.round((DAYS - d) * 0.35);
    const n = Math.max(3, Math.round((weekend ? base * 0.55 : base) * (0.7 + Math.random() * 0.7)));

    for (let i = 0; i < n; i++) {
      const isNew = Math.random() < 0.72;
      const visitorId = isNew ? `v-${d}-${i}-${Math.random().toString(36).slice(2, 8)}` : pick(visitors) || `v-${d}-${i}`;
      if (isNew) visitors.push(visitorId);
      const sessionId = `s-${d}-${i}-${Math.random().toString(36).slice(2, 8)}`;
      const [utmSource, utmMedium, utmCampaign, referrer] = pick(SOURCES);
      const device = pick(DEVICES);
      const pages = 1 + Math.floor(Math.random() * 3);

      for (let p = 0; p < pages; p++) {
        const at = new Date(day);
        at.setHours(7 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 60), 0, 0);
        views.push({
          path: p === 0 ? "/" : pick(PATHS),
          referrer, utmSource, utmMedium, utmCampaign, device,
          visitorId, sessionId, isNew: isNew && p === 0, createdAt: at,
        });
      }
    }
  }

  await db.pageview.deleteMany({});
  await db.pageview.createMany({ data: views });
  console.log(`✔ ${views.length} pages vues de démonstration sur ${DAYS} jours`);

  const NAMES: [string, string | null][] = [["Julien Marchand", "BTP Oise Construction"], ["Sophie Delcourt", "Boutique Delcourt"], ["Karim Benali", "Logistique Nord"], ["Claire Fontaine", null], ["Marc Petit", "Concession Auto 60"], ["Nadia Cherif", "Résidence Les Tilleuls"]];
  const SERVICES = ["Rondes de surveillance", "Gardiennage", "Alarmes & télésurveillance", "Plusieurs services / je ne sais pas encore"];
  const CITIES = ["Senlis (60300)", "Creil (60100)", "Chantilly (60500)", "Compiègne (60200)", "Beauvais (60000)"];
  const STATUS = ["NEW", "NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;

  await db.lead.deleteMany({});
  for (let i = 0; i < 14; i++) {
    const [name, company] = pick(NAMES);
    const [utmSource, utmMedium, utmCampaign] = pick(SOURCES);
    await db.lead.create({
      data: {
        name, company, service: pick([...SERVICES]), city: pick(CITIES),
        email: name.toLowerCase().replace(/[^a-z]/g, ".") + "@exemple.fr",
        phone: "06 " + Math.floor(10 + Math.random() * 89) + " " + Math.floor(10 + Math.random() * 89) + " 00 00",
        message: pick(["Deux passages par nuit sur un chantier, à partir du mois prochain.", "Besoin d'un agent en poste le week-end.", "Reprise d'une alarme existante avec télésurveillance.", ""]) || null,
        status: pick([...STATUS]), utmSource, utmMedium, utmCampaign,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 864e5),
      },
    });
  }
  console.log("✔ 14 demandes de devis de démonstration");
}

main().finally(() => db.$disconnect());
