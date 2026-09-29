import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, sessionCookieOptions } from "@/lib/auth";
import { fail, ok, readJson, validationFailure } from "@/lib/api";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { dbConnect, isDatabaseConfigured } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

export const runtime = "nodejs";

// Compared when the email does not match, so response timing does not reveal valid emails.
const DUMMY_HASH = "$2b$12$3zqBMF5otVBFuH61B09W0OmKfQuactl9zD33AyIbsvKPGCCDM1Elu";

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);
}

export async function POST(request: NextRequest) {
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const passwordHash = (process.env.ADMIN_PASSWORD_HASH || "").trim();

  if (!adminEmail || !isBcryptHash(passwordHash) || (process.env.SESSION_SECRET || "").length < 32) {
    console.error("[auth] Admin login is not configured: check ADMIN_EMAIL, ADMIN_PASSWORD_HASH and SESSION_SECRET.");
    return fail("Admin login is not configured on the server.", 503);
  }

  const ip = getClientIp(request);
  const limit = await rateLimit("admin-login", ip, 8, 15 * 60);
  if (!limit.allowed) {
    return fail(`Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`, 429);
  }

  const parsed = loginSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailure(parsed.error);

  const { email, password } = parsed.data;
  const emailMatches = email === adminEmail;
  const passwordMatches = await bcrypt.compare(password, emailMatches ? passwordHash : DUMMY_HASH);

  if (!emailMatches || !passwordMatches) {
    return fail("Incorrect email or password.", 401);
  }

  const token = await createSessionToken(adminEmail);

  if (isDatabaseConfigured()) {
    try {
      await dbConnect();
      await AdminUser.updateOne(
        { email: adminEmail },
        { $set: { lastLoginAt: new Date(), lastLoginIp: ip }, $inc: { loginCount: 1 }, $setOnInsert: { role: "admin" } },
        { upsert: true },
      );
    } catch (error) {
      console.error("[auth] could not record login:", error);
    }
  }

  const response = ok({ email: adminEmail });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
  return response;
}
