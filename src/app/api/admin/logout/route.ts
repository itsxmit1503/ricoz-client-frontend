import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminSession";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);

    const response = NextResponse.json({
      success: true,
      message: "Admin session cleared successfully.",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (err) {
    console.error("[AdminAuth] Logout error:", err);
    return NextResponse.json(
      { success: false, message: "Could not clear session." },
      { status: 500 }
    );
  }
}
