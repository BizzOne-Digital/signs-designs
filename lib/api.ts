import "server-only";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: string; fieldErrors?: Record<string, string> };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status });
}

export function fail(error: string, status = 400, fieldErrors?: Record<string, string>) {
  return NextResponse.json<ApiFailure>({ success: false, error, ...(fieldErrors ? { fieldErrors } : {}) }, { status });
}

export function zodFieldErrors(error: ZodError): Record<string, string> {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  const result: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flat)) {
    if (messages && messages.length > 0) result[key] = messages[0];
  }
  return result;
}

export function validationFailure(error: ZodError) {
  const first = error.issues[0]?.message ?? "Please check the highlighted fields.";
  return fail(first, 422, zodFieldErrors(error));
}

/** Logs the real error server-side and returns a generic message to the client. */
export function serverError(context: string, error: unknown) {
  console.error(`[api] ${context}:`, error);
  if (error instanceof Error && error.message === "MONGODB_URI is not configured.") {
    return fail("The database is not configured yet. Add MONGODB_URI to the environment.", 503);
  }
  if (isDuplicateKeyError(error)) {
    return fail("A record with the same unique value already exists.", 409);
  }
  return fail("Something went wrong on our side. Please try again.", 500);
}

export function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000;
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
