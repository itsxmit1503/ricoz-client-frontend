import { NextRequest, NextResponse } from "next/server";
import { proxyAdminRequest } from "@/lib/adminBackendProxy";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request payload. Expected JSON body." },
      { status: 400 }
    );
  }

  const isActive = body?.isActive;
  if (typeof isActive !== "boolean") {
    return NextResponse.json(
      { success: false, message: "isActive must be a boolean (true or false)." },
      { status: 400 }
    );
  }

  return proxyAdminRequest({
    method: "PATCH",
    path: `/admin/users/${encodeURIComponent(id)}/status`,
    body: { isActive },
  });
}
