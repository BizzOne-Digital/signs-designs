import "server-only";
import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { fail } from "@/lib/api";

/** Returns a 401 response when the request has no valid admin session, otherwise null. */
export async function denyUnlessAdmin(request: NextRequest) {
  const session = await requireAdmin(request);
  return session ? null : fail("Unauthorized. Please sign in.", 401);
}

export type IdContext = { params: Promise<{ id: string }> };

export async function readId(context: IdContext): Promise<string | null> {
  const { id } = await context.params;
  return isValidObjectId(id) && /^[a-f\d]{24}$/i.test(id) ? id : null;
}
