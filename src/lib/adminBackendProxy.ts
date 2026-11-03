import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./adminSession";

export const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const ADMIN_SECRET =
  process.env.ADMIN_SESSION_SECRET || "ricoz-admin-secret-2026";

export interface ProxyOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
}

/**
 * Validates the admin session from cookies and proxies the request to the Ricoz MFG backend.
 * Returns standard NextResponse with proper HTTP status and informative JSON body.
 */
export async function proxyAdminRequest(opts: ProxyOptions): Promise<NextResponse> {
  // 1. Session verification
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);

  // In development, if no cookie exists but dev mode is active, allow local preview/dev access
  if (!session && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "Administrative session required. Please authenticate at /admin/login.",
      },
      { status: 401 }
    );
  }

  // 2. Build target URL
  let targetUrl = `${BACKEND_URL.replace(/\/+$/, "")}${opts.path.startsWith("/") ? opts.path : `/${opts.path}`}`;
  if (opts.params) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(opts.params)) {
      if (val !== undefined && val !== "") {
        searchParams.set(key, String(val));
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      targetUrl += (targetUrl.includes("?") ? "&" : "?") + qs;
    }
  }

  // 3. Dispatch to backend
  try {
    const fetchOptions: RequestInit = {
      method: opts.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_SECRET,
        "x-actor-email": session?.email || "admin@ricoz.mfg",
      },
      cache: "no-store",
    };

    if (opts.body && opts.method && ["POST", "PUT", "PATCH"].includes(opts.method)) {
      fetchOptions.body = JSON.stringify(opts.body);
    }

    const res = await fetch(targetUrl, fetchOptions);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    const text = await res.text();
    return NextResponse.json(
      {
        success: res.ok,
        message: text || res.statusText,
      },
      { status: res.status }
    );
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        success: false,
        code: "BACKEND_UNAVAILABLE",
        message: `Ricoz MFG backend unreachable at ${BACKEND_URL}: ${error.message || "Connection refused"}. Ensure backend server is running.`,
      },
      { status: 503 }
    );
  }
}
