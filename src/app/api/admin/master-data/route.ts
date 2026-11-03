import { NextRequest } from "next/server";
import { proxyAdminRequest } from "@/lib/adminBackendProxy";

export async function GET(req: NextRequest) {
  return proxyAdminRequest({
    method: "GET",
    path: "/admin/master-data",
  });
}
