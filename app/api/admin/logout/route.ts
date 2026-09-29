import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  const response = ok({ loggedOut: true });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}
