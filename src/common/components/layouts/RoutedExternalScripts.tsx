import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import Script from 'next/script';

type ScriptStrategy = 'afterInteractive' | 'lazyOnload';

type RoutedExternalScriptItem = {
  id?: string;
  src: string;
  strategy?: ScriptStrategy;
  enabled?: boolean;
};

type RoutedExternalScriptsConfig = {
  scripts: RoutedExternalScriptItem[];
};

const EXTERNAL_SCRIPTS_FEATURE_KEY = 'search:external-scripts-config';
const DEFAULT_CONFIG: RoutedExternalScriptsConfig = { scripts: [] };

/**
 * اسکریپت‌هایی که کارشان به کدِ همین repo منتقل شده و دیگر نباید تزریق شوند.
 *
 * `search-cards-presence.js` متنِ «X پیش آنلاین بوده» و نقطه‌ی سبزِ آنلاین را روی کارتِ نتیجه
 * می‌نشاند. آن رفتار از 2026-08-31 بومی است (`src/modules/search/components/productCard/
 * doctorPresence.ts` + هوکِ `useDoctorPresence`) و روی production تأیید شده. نگه‌داشتنِ اسکریپت
 * یعنی یک درخواستِ اضافه به ازای هر صفحه و یک وابستگیِ نامرئی به نامِ کلاسِ تولیدشده‌ی Plasmic.
 *
 * چرا این‌جا و نه در GrowthBook: ردیفِ خودِ فلگ هم باید پاک شود، ولی کلیدِ نوشتنیِ GrowthBook در
 * دسترسِ این تغییر نبود. این denylist اثرِ کاربر-محور را همین حالا می‌گیرد و بعد از پاک‌شدنِ ردیف
 * می‌تواند برداشته شود. تطبیق روی مسیر است تا با عوض‌شدنِ هاست یا query string دور نخورد.
 */
const RETIRED_SCRIPT_PATHS = ['/scripts/search-cards-presence.js'];

export function isRetiredScript(src: string): boolean {
  try {
    return RETIRED_SCRIPT_PATHS.includes(new URL(src).pathname);
  } catch {
    return false;
  }
}

function shouldLoadRoutedExternalScripts(pathname: string): boolean {
  if (pathname.startsWith('/s/')) return true;
  if (pathname === '/' || pathname === '/apphome') return true;
  if (pathname.startsWith('/dr/')) return true;
  if (pathname.startsWith('/center/')) return true;
  return false;
}

function isValidHttpUrl(url: unknown): url is string {
  return typeof url === 'string' && /^https?:\/\//.test(url);
}

function normalizeConfig(config: RoutedExternalScriptsConfig): RoutedExternalScriptItem[] {
  if (!config || !Array.isArray(config.scripts)) return [];

  return config.scripts
    .filter(item => item?.enabled !== false && isValidHttpUrl(item?.src) && !isRetiredScript(item.src))
    .map(item => ({
      id: item.id,
      src: item.src,
      strategy: item.strategy === 'afterInteractive' ? 'afterInteractive' : 'lazyOnload',
      enabled: item.enabled,
    }));
}

export function RoutedExternalScripts() {
  const router = useRouter();
  const config = useFeatureValue<RoutedExternalScriptsConfig>(EXTERNAL_SCRIPTS_FEATURE_KEY, DEFAULT_CONFIG);
  const scripts = normalizeConfig(config);
  const shouldLoad = shouldLoadRoutedExternalScripts(router.pathname);

  if (!shouldLoad || scripts.length === 0) return null;

  return (
    <>
      {scripts.map((script, index) => (
        <Script key={script.id || `${script.src}-${index}`} id={script.id} src={script.src} strategy={script.strategy} />
      ))}
    </>
  );
}
