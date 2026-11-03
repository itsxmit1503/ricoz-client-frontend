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

  const role = body?.role;
  const validRoles = ["admin", "supervisor", "operator", "user"];

  if (!role || !validRoles.includes(role)) {
    return NextResponse.json(
      {
        success: false,
        message: `Invalid role '${role}'. Supported roles are: ${validRoles.join(", ")}.`,
      },
      { status: 400 }
    );
  }

  return proxyAdminRequest({
    method: "PATCH",
    path: `/admin/users/${encodeURIComponent(id)}/role`,
    body: { role },
  });
}
