"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createSession, destroySession, verifyLogin, hashPassword, requireSession, requireOwner } from "@/lib/auth";

export type FormState = { error?: string; ok?: string };

/* ---------------------------------------------------------------- session */

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get("email") || "").trim();
  const password = String(fd.get("password") || "");
  const next = String(fd.get("next") || "/admin");

  if (!email || !password) return { error: "Renseignez votre e-mail et votre mot de passe." };

  const admin = await verifyLogin(email, password).catch(() => null);
  if (!admin) return { error: "E-mail ou mot de passe incorrect." };

  await createSession({ sub: admin.id, email: admin.email, name: admin.name, role: admin.role });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ leads */

export async function setLeadStatus(id: string, status: "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST") {
  await requireSession();
  await db.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/devis");
}

export async function saveLeadNotes(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireSession();
  const id = String(fd.get("id") || "");
  await db.lead.update({ where: { id }, data: { notes: String(fd.get("notes") || "") || null } });
  revalidatePath("/admin/devis");
  return { ok: "Note enregistrée." };
}

export async function deleteLead(id: string) {
  await requireSession();
  await db.lead.delete({ where: { id } });
  revalidatePath("/admin/devis");
}

/* --------------------------------------------------------------- services */

const lines = (v: FormDataEntryValue | null) =>
  String(v || "").split("\n").map((s) => s.trim()).filter(Boolean);

/** Parse un tableau JSON saisi dans le back-office (formules, FAQ). */
const parseJsonArray = (v: FormDataEntryValue | null): Prisma.InputJsonValue => {
  const raw = String(v || "").trim();
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("JSON invalide : vérifiez les guillemets et les virgules.");
  }
  if (!Array.isArray(parsed)) throw new Error("Le JSON doit être un tableau [ … ].");
  return parsed as Prisma.InputJsonValue;
};

const ServiceSchema = z.object({
  slug: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/, "Slug : minuscules, chiffres et tirets uniquement"),
  title: z.string().trim().min(2).max(120),
  navLabel: z.string().trim().max(28),
  tagline: z.string().trim().max(60),
  excerpt: z.string().trim().min(10).max(600),
  heroImage: z.string().trim().min(1),
  cardImage: z.string().trim().min(1),
  intro: z.string().trim().min(10),
  bodyTitle: z.string().trim().min(3).max(200),
  bodyHtml: z.string().trim(),
  ctaTitle: z.string().trim().min(3).max(200),
  ctaText: z.string().trim().min(3),
  metaTitle: z.string().trim().min(3).max(200),
  metaDesc: z.string().trim().min(10).max(400),
  position: z.coerce.number().int().min(0).max(999),
  published: z.boolean(),
});

export async function saveService(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireSession();
  const id = String(fd.get("id") || "");

  try {
    const data = ServiceSchema.parse({
      slug: fd.get("slug"), title: fd.get("title"), navLabel: fd.get("navLabel"), tagline: fd.get("tagline"),
      excerpt: fd.get("excerpt"), heroImage: fd.get("heroImage"), cardImage: fd.get("cardImage"),
      intro: fd.get("intro"), bodyTitle: fd.get("bodyTitle"), bodyHtml: fd.get("bodyHtml"),
      ctaTitle: fd.get("ctaTitle"), ctaText: fd.get("ctaText"),
      metaTitle: fd.get("metaTitle"), metaDesc: fd.get("metaDesc"),
      position: fd.get("position"), published: fd.get("published") === "on",
    });

    const payload = {
      ...data,
      features: lines(fd.get("features")),
      formulas: parseJsonArray(fd.get("formulas")),
      faqs: parseJsonArray(fd.get("faqs")),
    };

    if (id) await db.service.update({ where: { id }, data: payload });
    else await db.service.create({ data: payload });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    const msg = e instanceof Error ? e.message : "Enregistrement impossible";
    return { error: msg.includes("Unique") ? "Ce slug est déjà utilisé." : msg };
  }

  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
  redirect("/admin/services?ok=1");
}

export async function deleteService(id: string) {
  await requireOwner();
  await db.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
}

/* --------------------------------------------------------------- articles */

const ArticleSchema = z.object({
  slug: z.string().trim().min(2).max(90).regex(/^[a-z0-9-]+$/, "Slug : minuscules, chiffres et tirets uniquement"),
  title: z.string().trim().min(4).max(200),
  excerpt: z.string().trim().min(20).max(600),
  coverImage: z.string().trim().min(1),
  contentHtml: z.string().trim().min(20),
  readMinutes: z.coerce.number().int().min(1).max(60),
  published: z.boolean(),
  metaTitle: z.string().trim().max(200).optional(),
  metaDesc: z.string().trim().max(400).optional(),
});

export async function saveArticle(_prev: FormState, fd: FormData): Promise<FormState> {
  const session = await requireSession();
  const id = String(fd.get("id") || "");

  try {
    const data = ArticleSchema.parse({
      slug: fd.get("slug"), title: fd.get("title"), excerpt: fd.get("excerpt"),
      coverImage: fd.get("coverImage"), contentHtml: fd.get("contentHtml"),
      readMinutes: fd.get("readMinutes"), published: fd.get("published") === "on",
      metaTitle: String(fd.get("metaTitle") || ""), metaDesc: String(fd.get("metaDesc") || ""),
    });

    const tags = String(fd.get("tags") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const existing = id ? await db.article.findUnique({ where: { id }, select: { publishedAt: true } }) : null;

    const payload = {
      ...data,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      tags,
      publishedAt: data.published ? existing?.publishedAt ?? new Date() : null,
      authorId: session.sub,
    };

    if (id) await db.article.update({ where: { id }, data: payload });
    else await db.article.create({ data: payload });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message };
    const msg = e instanceof Error ? e.message : "Enregistrement impossible";
    return { error: msg.includes("Unique") ? "Ce slug est déjà utilisé." : msg };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  redirect("/admin/articles?ok=1");
}

export async function deleteArticle(id: string) {
  await requireSession();
  await db.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
}

/* ----------------------------------------------------------------- admins */

export async function saveAdmin(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireOwner();
  const id = String(fd.get("id") || "");
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const name = String(fd.get("name") || "").trim();
  const role = String(fd.get("role") || "EDITOR") === "OWNER" ? "OWNER" : "EDITOR";
  const password = String(fd.get("password") || "");
  const active = fd.get("active") === "on";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "E-mail invalide." };
  if (name.length < 2) return { error: "Nom trop court." };
  if (!id && password.length < 10) return { error: "Le mot de passe doit faire au moins 10 caractères." };
  if (password && password.length < 10) return { error: "Le mot de passe doit faire au moins 10 caractères." };
  if (id === me.sub && (!active || role !== "OWNER")) {
    return { error: "Vous ne pouvez pas retirer vos propres droits ni vous désactiver." };
  }

  try {
    const base = { email, name, role: role as "OWNER" | "EDITOR", active };
    if (id) {
      await db.admin.update({
        where: { id },
        data: password ? { ...base, passwordHash: await hashPassword(password) } : base,
      });
    } else {
      await db.admin.create({ data: { ...base, passwordHash: await hashPassword(password) } });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Enregistrement impossible";
    return { error: msg.includes("Unique") ? "Cet e-mail est déjà utilisé." : msg };
  }

  revalidatePath("/admin/admins");
  return { ok: id ? "Administrateur mis à jour." : "Administrateur créé." };
}

export async function deleteAdmin(id: string) {
  const me = await requireOwner();
  if (id === me.sub) throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  const owners = await db.admin.count({ where: { role: "OWNER", active: true } });
  const target = await db.admin.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "OWNER" && owners <= 1) throw new Error("Il doit rester au moins un propriétaire.");
  await db.admin.delete({ where: { id } });
  revalidatePath("/admin/admins");
}

/* ---------------------------------------------------------------- réglages */

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireOwner();
  const entries: Record<string, string> = {
    phone: String(fd.get("phone") || "").trim(),
    phoneDisplay: String(fd.get("phoneDisplay") || "").trim(),
    whatsapp: String(fd.get("whatsapp") || "").replace(/\D/g, ""),
    email: String(fd.get("email") || "").trim(),
  };
  if (!entries.phone.startsWith("+")) return { error: "Le téléphone doit être au format international (+33…)." };
  if (!/^\d{8,15}$/.test(entries.whatsapp)) return { error: "Numéro WhatsApp invalide (chiffres uniquement, ex. 33652920387)." };

  for (const [key, value] of Object.entries(entries)) {
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  revalidatePath("/", "layout");
  return { ok: "Réglages enregistrés." };
}
