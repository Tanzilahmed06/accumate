const LEGACY_PUBLIC_APP_URL = 'https://accumate.vercel.app';

function decodePathToken(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    // A malformed encoded token is simply an unknown token, never a route error.
    return value;
  }
}

function runtimeOrigin() {
  return typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : LEGACY_PUBLIC_APP_URL;
}

function normaliseBaseUrl(value: string) {
  try {
    return new URL(value).origin.replace(/\/$/, '');
  } catch {
    return runtimeOrigin();
  }
}

/**
 * The deployed verification origin. VITE_PUBLIC_APP_URL takes priority, while
 * an unconfigured deployment uses its own current origin rather than a stale
 * hard-coded Vercel project URL.
 */
export function getPublicAppUrl() {
  return normaliseBaseUrl(import.meta.env.VITE_PUBLIC_APP_URL?.trim() || runtimeOrigin());
}

export function isStaleLegacyVerificationUrl(value: string | undefined) {
  if (!value) return false;
  try {
    return new URL(value).origin === LEGACY_PUBLIC_APP_URL && getPublicAppUrl() !== LEGACY_PUBLIC_APP_URL;
  } catch {
    return false;
  }
}

export function buildVerificationPath(verificationToken: string) {
  return `/verify/${encodeURIComponent(verificationToken)}`;
}

export function buildVerificationUrl(verificationToken: string) {
  return `${getPublicAppUrl()}${buildVerificationPath(verificationToken)}`;
}

/** Accept a token on its own or the permanent URL encoded in a QR code. */
export function extractVerificationToken(reference: string) {
  const trimmed = reference.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed, getPublicAppUrl());
    const match = url.pathname.match(/^\/verify\/([^/]+)\/?$/);
    if (match) return decodePathToken(match[1]);

    // Kept only so previously-issued prototype links can still be looked up.
    return url.searchParams.get('id') || url.searchParams.get('cert') || trimmed;
  } catch {
    return trimmed;
  }
}

export function isVerificationRoute(pathname: string) {
  return /^\/verify(?:\/|$)/.test(pathname) || pathname === '/verify-certificate';
}

export function verificationTokenFromPath(pathname: string) {
  const match = pathname.match(/^\/verify\/([^/]+)\/?$/);
  return match ? decodePathToken(match[1]) : undefined;
}
