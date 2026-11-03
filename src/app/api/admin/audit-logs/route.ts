import { NextRequest } from "next/server";
import { proxyAdminRequest } from "@/lib/adminBackendProxy";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: Record<string, string> = {};

  ["page", "limit", "action", "outcome", "search"].forEach((key) => {
    const val = searchParams.get(key);
    if (val) params[key] = val;
  });

  return proxyAdminRequest({
    method: "GET",
    path: "/admin/audit-logs",
    params,
  });
}
