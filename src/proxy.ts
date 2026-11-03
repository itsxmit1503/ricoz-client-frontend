import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

const hasClerkKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY
);

const clerkHandler = hasClerkKey
  ? clerkMiddleware(async (auth, req) => {
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
      const hasAdminSession = Boolean(req.cookies.get("ricoz_admin_session")?.value);
      const hasAdminAccess = isAuthenticated || hasAdminSession;

      if (pathname.startsWith("/admin/login") && hasAdminAccess) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      // 4. Standard dashboard protection
      if (pathname.startsWith("/dashboard") && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // 5. Admin panel protection (permits Clerk auth OR valid admin session cookie)
      if (
        pathname.startsWith("/admin") &&
        !pathname.startsWith("/admin/login") &&
        !hasAdminAccess
      ) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      return NextResponse.next();
    })
  : null;

export default function middleware(req: NextRequest, evt: NextFetchEvent) {
  if (!clerkHandler) {
    return NextResponse.next();
  }
  return (clerkHandler as any)(req, evt);
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
