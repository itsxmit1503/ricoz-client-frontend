import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

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

export default function middleware(req: NextRequest, evt: NextFetchEvent) {
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
