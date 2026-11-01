import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth();
  const pathname = req.nextUrl.pathname;

  // 1. Public UI Preview routes for design inspection
  if (pathname === "/admin/preview" || pathname.startsWith("/admin/preview/")) {
    return NextResponse.next();
  }

  // 2. Authenticated user opening landing page -> dashboard
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Authenticated admin opening admin login -> admin dashboard
  if (pathname.startsWith("/admin/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 4. Standard dashboard protection
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 5. Admin panel protection
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
