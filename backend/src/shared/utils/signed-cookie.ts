import crypto from 'crypto';

// ============================================================================
// Types
// ============================================================================

export interface AuthStatePayload {
  userId: string;
  role: 'admin' | 'customer';
  exp: number; // Unix timestamp
}

// ============================================================================
// Constants
// ============================================================================

const COOKIE_SECRET =
  process.env.COOKIE_SECRET || process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'authState';
const SEPARATOR = '.';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * ساخت امضای HMAC-SHA256
 */
function createSignature(data: string): string {
  return crypto
    .createHmac('sha256', COOKIE_SECRET)
    .update(data)
    .digest('base64url');
}

/**
 * تبدیل payload به base64url
 */
function encodePayload(payload: AuthStatePayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * تبدیل base64url به payload
 */
function decodePayload(encoded: string): AuthStatePayload | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * ساخت کوکی امضا شده
 * فرمت: base64url(payload).signature
 */
export function createSignedAuthState(
  userId: string,
  role: 'admin' | 'customer',
  expiresInSeconds: number = 7 * 24 * 60 * 60, // 7 روز
): string {
  const payload: AuthStatePayload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = encodePayload(payload);
  const signature = createSignature(encodedPayload);

  return `${encodedPayload}${SEPARATOR}${signature}`;
}

/**
 * تایید و خواندن کوکی امضا شده
 * برمی‌گردونه payload اگه معتبر باشه، وگرنه null
 */
export function verifySignedAuthState(
  cookieValue: string,
): AuthStatePayload | null {
  if (!cookieValue) return null;

  const parts = cookieValue.split(SEPARATOR);
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;

  // تایید امضا
  const expectedSignature = createSignature(encodedPayload);
  if (signature !== expectedSignature) {
    return null; // امضا نامعتبر - دستکاری شده
  }

  // decode کردن payload
  const payload = decodePayload(encodedPayload);
  if (!payload) return null;

  // بررسی انقضا
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null; // منقضی شده
  }

  return payload;
}

/**
 * نام کوکی
 */
export function getAuthStateCookieName(): string {
  return COOKIE_NAME;
}
