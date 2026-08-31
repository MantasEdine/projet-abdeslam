import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const SESSION_COOKIE = "regiis_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET manquant ou trop court. Ajoutez-le dans .env (32 caractères minimum)."
    );
  }
  return new TextEncoder().encode(s);
}

export type SessionPayload = { sub: string; email: string; name: string; role: "OWNER" | "EDITOR" };

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** À utiliser dans toute page/route d'administration. Lève si non connecté. */
export async function requireSession(): Promise<SessionPayload> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}

export async function requireOwner(): Promise<SessionPayload> {
  const s = await requireSession();
  if (s.role !== "OWNER") throw new Error("FORBIDDEN");
  return s;
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyLogin(email: string, password: string) {
  const admin = await db.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin || !admin.active) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  await db.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  return admin;
}
