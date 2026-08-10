/** آدرس‌های ثابت منوهای اصلی drapp — بدون وابستگی به API همادست برای ساخت سریع iframe */
export const KNOWN_DRAPP_EMBED_SRC: Record<string, string> = {
  'drapp/appointments': 'https://providers.paziresh24.com/app/my-patients',
  'drapp/workhours': 'https://providers.paziresh24.com/app/workhour/',
  'drapp/vacation': 'https://providers.paziresh24.com/app/vacation/',
};

export function getKnownDrappEmbedSrc(appKey?: string, menuKey?: string): string | undefined {
  if (!appKey || !menuKey) return undefined;
  return KNOWN_DRAPP_EMBED_SRC[`${appKey}/${menuKey}`];
}

export function buildDashboardEmbedSrc(embedSrc: string, userId: string, search?: string): string {
  const query = search ? `${search}&user_id=${userId}` : `?user_id=${userId}`;
  return `${embedSrc}${query}`;
}
