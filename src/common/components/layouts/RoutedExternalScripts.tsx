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
    .filter(item => item?.enabled !== false && isValidHttpUrl(item?.src))
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
