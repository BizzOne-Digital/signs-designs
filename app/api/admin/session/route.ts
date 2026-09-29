import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return fail("Unauthorized. Please sign in.", 401);
  return ok({ authenticated: true, email: session.email });
}
