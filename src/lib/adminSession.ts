/**
 * Private Admin Console - Session and Authentication Utilities
 *
 * Provides isolated, lightweight, HMAC-SHA256 signed session tokens
 * using standard Web Crypto API (fully compatible with Next.js Edge middleware
 * and Node.js route handlers).
 */

export interface AdminSessionPayload {
  email: string;
  role: "admin";
  createdAt: number;
  exp: number;
}

export const ADMIN_COOKIE_NAME = "ricoz_admin_session";
export const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function getSecretKeyString(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_DEV_PASSWORD ||
    "ricoz-mfg-admin-private-dev-session-secret-key-2026"
  );
}

/**
 * Checks whether temporary development admin login is permitted.
 * Fails closed in production unless explicitly enabled via ADMIN_DEV_ENABLED="true".
 */
export function isAdminDevAuthEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  return process.env.ADMIN_DEV_ENABLED === "true";
}

/**
 * Returns development admin credentials from environment.
 * Never exposes hardcoded production credentials.
 */
export function getAdminDevCredentials() {
  return {
    email: (process.env.ADMIN_DEV_EMAIL || "admin@ricoz.mfg").trim().toLowerCase(),
    password: process.env.ADMIN_DEV_PASSWORD || "Admin#Ricoz2026!",
  };
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

async function getHmacCryptoKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs an admin session payload into an HMAC-SHA256 compact token.
 */
export async function createAdminSessionToken(
  params: { email: string }
): Promise<string> {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    email: params.email.trim().toLowerCase(),
    role: "admin",
    createdAt: now,
    exp: now + ADMIN_SESSION_DURATION_MS,
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = toBase64Url(textEncoder.encode(payloadJson));
  const key = await getHmacCryptoKey(getSecretKeyString());
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(payloadB64)
  );
  const sigB64 = toBase64Url(new Uint8Array(signatureBuffer));

  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies the HMAC-SHA256 signature and expiration of an admin session token.
 * Returns null if tampered, expired, or malformed.
 */
export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  try {
    const key = await getHmacCryptoKey(getSecretKeyString());
    const sigBytes = fromBase64Url(sigB64) as unknown as BufferSource;
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      textEncoder.encode(payloadB64) as unknown as BufferSource
    );

    if (!isValid) return null;

    const payloadJson = textDecoder.decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(payloadJson) as AdminSessionPayload;

    if (!payload || payload.role !== "admin" || !payload.exp) {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
