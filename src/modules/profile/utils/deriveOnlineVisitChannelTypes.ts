/**
 * Derive Plasmic onlineVisit.channels from bookable online-visit service titles.
 * profiles-api does not expose online_visit_channel_types yet; product maps
 * `whatsapp` → پیام‌رسان پذیرش۲۴ and falls back to ایتا when whatsapp is absent.
 */
export function deriveOnlineVisitChannelTypesFromServices(
  services: Array<{ alias_title?: string | null; title?: string | null }> | null | undefined,
): string[] {
  const channels = new Set<string>();

  for (const service of services ?? []) {
    const title = String(service?.alias_title ?? service?.title ?? '');
    if (!title.trim()) continue;

    if (/واتساپ|whatsapp/i.test(title)) {
      channels.add('whatsapp');
    }
    if (/ایتا|eitaa/i.test(title)) {
      channels.add('eitaa');
      channels.add('eitaa_number');
    }
    if (/secure[_\s-]?call|تماس\s*امن/i.test(title)) {
      channels.add('secure_call');
    }
  }

  return Array.from(channels);
}
