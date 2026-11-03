import { NextRequest, NextResponse } from "next/server";
import { proxyAdminRequest } from "@/lib/adminBackendProxy";

export async function GET(req: NextRequest) {
  return proxyAdminRequest({
    method: "GET",
    path: "/admin/settings",
  });
}

export async function PUT(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request payload. Expected JSON body." },
      { status: 400 }
    );
  }

  return proxyAdminRequest({
    method: "PUT",
    path: "/admin/settings",
    body,
  });
}
