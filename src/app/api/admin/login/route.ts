import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_DURATION_MS,
  createAdminSessionToken,
  getAdminDevCredentials,
  isAdminDevAuthEnabled,
} from "@/lib/adminSession";

export async function POST(request: Request) {
  try {
    // 1. Production isolation check
    if (!isAdminDevAuthEnabled()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Temporary development admin login is disabled in this environment. Production requires enterprise SSO / IdP integration.",
        },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    // 2. Validate input format
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Both administrator email and password are required.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid administrator email address.",
        },
        { status: 400 }
      );
    }

    // 3. Verify against development environment credentials
    const expected = getAdminDevCredentials();

    if (email !== expected.email || password !== expected.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid administrator credentials.",
        },
        { status: 401 }
      );
    }

    // 4. Create cryptographically signed session token
    const token = await createAdminSessionToken({ email });

    // 5. Establish secure HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(ADMIN_SESSION_DURATION_MS / 1000),
    });

    return NextResponse.json({
      success: true,
      message: "Admin session established.",
      user: {
        email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("[AdminAuth] Login error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "An internal error occurred during authentication.",
      },
      { status: 500 }
    );
  }
}
