import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./lib/adminSession";

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const clerkHandler = hasClerkKey
  ? clerkMiddleware(async (auth, req) => {
      const pathname = req.nextUrl.pathname;

      if (
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/")
      ) {
        const { isAuthenticated, redirectToSignIn } = await auth();

        if (!isAuthenticated) {
          return redirectToSignIn();
        }
      }
    })
  : null;

export default async function middleware(req: NextRequest, evt: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // 1. Isolated Admin Console route protection
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(adminToken);

    if (pathname === "/admin/login") {
      if (session) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Existing application and Clerk middleware
  if (!clerkHandler) {
    return NextResponse.next();
  }
  return clerkHandler(req, evt);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',

    // Required by Clerk
    '/__clerk/:path*',
  ],
};
