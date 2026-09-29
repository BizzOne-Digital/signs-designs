"use client";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;
  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type ApiEnvelope<T> = { success: true; data: T } | { success: false; error: string; fieldErrors?: Record<string, string> };

/** JSON fetch wrapper for the admin API. Throws ApiError with the server's message on failure. */
export async function apiRequest<T>(url: string, options: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    credentials: "same-origin",
    cache: "no-store",
  });

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = null;
  }

  if (response.status === 401 && typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    // Full reload on purpose: clears all client state after the session expires.
    const loginUrl = new URL("/admin/login", window.location.origin);
    loginUrl.searchParams.set("next", window.location.pathname);
    window.location.replace(loginUrl.toString());
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (!payload) throw new ApiError("Unexpected response from the server.", response.status);
  if (!response.ok || !payload.success) {
    const failure = payload as { error?: string; fieldErrors?: Record<string, string> };
    throw new ApiError(failure.error || "Request failed.", response.status, failure.fieldErrors);
  }
  return payload.data;
}

export function errorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
