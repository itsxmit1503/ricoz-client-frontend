import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/adminBackendProxy";

export async function GET() {
  const url = `${BACKEND_URL.replace(/\/+$/, "")}/`;
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    const data = await res.json().catch(() => null);
    const statusText = data?.service ? `${data.service} v${data.version || "1.0"}` : `HTTP ${res.status}`;

    return NextResponse.json({
      online: res.ok,
      url: BACKEND_URL,
      statusText: res.ok ? statusText : `HTTP ${res.status}`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({
      online: false,
      url: BACKEND_URL,
      statusText: error.message || "Connection refused",
    });
  }
}
