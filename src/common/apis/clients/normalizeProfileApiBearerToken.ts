/**
 * profiles-api auth (API_AUTH_DRIVER on the API side):
 * - static: token is literally `test` | `write` | `admin`
 * - db: token is an API key from `php artisan apikey:create`
 *
 * We always send `Authorization: Bearer <token>`. If env accidentally includes the
 * `Bearer ` prefix, strip it once so we never send `Bearer Bearer ...`.
 */
export function normalizeProfileApiBearerToken(raw: string): string {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return '';
  return trimmed.replace(/^Bearer\s+/i, '').trim();
}
