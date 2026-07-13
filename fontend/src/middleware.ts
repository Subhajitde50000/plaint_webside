import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/checkout",
  "/profile",
  "/account",
  "/orders",
  "/admin",
  "/wishlist",
];

// Routes that should redirect authenticated users away (auth pages)
const AUTH_ROUTES = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth-only (redirect logged-in users to home)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // We detect authentication by the presence of a refresh_token cookie
  // (set by FastAPI as HttpOnly — we cannot read its value, only its existence)
  const hasRefreshCookie = request.cookies.has("refresh_token");

  if (isProtectedRoute && !hasRefreshCookie) {
    // Redirect to login, preserving the intended destination
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasRefreshCookie) {
    // Already logged in — redirect to homepage
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, fonts)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)",
  ],
};
