import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminSession";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);

    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: {
          email: session.email,
          role: session.role,
          createdAt: session.createdAt,
          expiresAt: session.exp,
        },
      });
    }

    try {
      const clerkAuth = await auth();
      if (clerkAuth && clerkAuth.userId) {
        const user = await currentUser();
        const primaryEmail = user?.emailAddresses?.[0]?.emailAddress || `${clerkAuth.userId}@clerk.user`;
        const role =
          (user?.publicMetadata?.role as string) ||
          (user?.unsafeMetadata?.role as string) ||
          "admin";
        return NextResponse.json({
          authenticated: true,
          user: {
            email: primaryEmail,
            role,
            name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || undefined,
          },
        });
      }
    } catch {
      // Clerk auth failed or unavailable
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
