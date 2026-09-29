import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "sde_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export type AdminSession = { email: string; role: "admin" };

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters long.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email.toLowerCase())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setIssuer("signs-designs-admin")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined | null): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
      issuer: "signs-designs-admin",
    });
    const email = typeof payload.sub === "string" ? payload.sub : "";
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    // Rotating ADMIN_EMAIL invalidates existing sessions.
    if (!email || payload.role !== "admin" || !adminEmail || email !== adminEmail) return null;
    return { email, role: "admin" };
  } catch {
    return null;
  }
}

/** For Server Components, layouts and server actions. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** For Route Handlers. Always re-verified server-side, even behind the proxy. */
export async function requireAdmin(request: NextRequest): Promise<AdminSession | null> {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
