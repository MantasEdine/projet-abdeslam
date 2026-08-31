import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const [services, articles] = await Promise.all([
    db.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    db.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
  ]);

  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${base}/articles`, changeFrequency: "weekly", priority: 0.7 },
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: s.updatedAt, priority: 0.9 })),
    ...articles.map((a) => ({ url: `${base}/articles/${a.slug}`, lastModified: a.updatedAt, priority: 0.6 })),
  ];
}
