import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isCrossOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== request.nextUrl.host;
  } catch {
    return true;
  }
}

/**
 * First line of defence for /admin/**, /api/admin/** and /api/upload.
 * Every route handler also re-verifies the session itself.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // Block cross-site form/fetch submissions to state-changing endpoints.
  if (!SAFE_METHODS.has(request.method) && isCrossOrigin(request)) {
    return NextResponse.json({ success: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  // Public quote endpoints pass through the origin check above but need no session.
  if (PUBLIC_ADMIN_PATHS.has(pathname) || pathname === "/api/quote" || pathname.startsWith("/api/quote/")) {
    return NextResponse.next();
  }

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (isApi) {
    return NextResponse.json({ success: false, error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = pathname !== "/admin" ? `?next=${encodeURIComponent(pathname)}` : "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/upload", "/api/quote", "/api/quote/:path*"],
};
