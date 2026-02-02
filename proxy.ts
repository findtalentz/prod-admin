import { NextRequest, NextResponse } from "next/server";
import getSessionFromToken from "./actions/get-session-from-token";

const PUBLIC_FILE_PATTERN = /\.(.*)$/;
const PROTECTED_ROUTES_PATTERN = /^\/dashboard/;
const AUTH_ROUTES = ["/log-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const session = await getSessionFromToken();
  const { pathname } = request.nextUrl;

  if (PUBLIC_FILE_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  const isAdmin = session?.session?.role === "ADMIN";
  const isProtectedRoute = PROTECTED_ROUTES_PATTERN.test(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Redirect non-admin users away from admin dashboard
  if (!isAdmin && isProtectedRoute) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  // Redirect authenticated users away from auth routes
  if (isAdmin && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon\\.ico).*)"],
};
