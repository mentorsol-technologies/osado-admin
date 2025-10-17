import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes are public
const publicRoutes = ["/login", "/signup", "/reset-password", "/verify-otp", "/create-password", "/forgot-password"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // 🧱 Case 1: User not authenticated and trying to access protected route
  if (!token && !publicRoutes.includes(pathname)) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🧱 Case 2: User authenticated but visiting a public route (like login)
  if (token && publicRoutes.includes(pathname)) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Protect all routes except for _next and static files
    */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};
