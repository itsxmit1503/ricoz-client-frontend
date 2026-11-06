import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/adminBackendProxy";

export async function GET() {
  const url = `${BACKEND_URL.replace(/\/+$/, "")}/`;
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    const data = await res.json().catch(() => null);
    const statusText = data?.service ? `${data.service} v${data.version || "1.0"}` : `HTTP ${res.status}`;

    // Also inspect backend database readiness
    let databaseStatus = "UNKNOWN";
    let dataSource = "store";
    try {
      const statsRes = await fetch(`${BACKEND_URL.replace(/\/+$/, "")}/admin/stats`, {
        headers: { "x-admin-key": process.env.ADMIN_SESSION_SECRET || "ricoz-admin-secret-2026" },
        cache: "no-store",
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        databaseStatus = statsData?.stats?.databaseStatus || "OFFLINE_STANDBY";
        dataSource = databaseStatus === "CONNECTED" ? "database" : "store";
      }
    } catch {
      databaseStatus = "OFFLINE_STANDBY";
    }

    return NextResponse.json({
      online: res.ok,
      url: BACKEND_URL,
      statusText: res.ok ? statusText : `HTTP ${res.status}`,
      databaseStatus,
      dataSource,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({
      online: false,
      url: BACKEND_URL,
      statusText: error.message || "Connection refused",
      databaseStatus: "UNREACHABLE",
      dataSource: "none",
    });
  }
}
