import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import Script from 'next/script';

type ScriptStrategy = 'afterInteractive' | 'lazyOnload';

type SearchExternalScriptItem = {
  id?: string;
  src: string;
  strategy?: ScriptStrategy;
  enabled?: boolean;
};

type SearchExternalScriptsConfig = {
  scripts: SearchExternalScriptItem[];
};

const SEARCH_EXTERNAL_SCRIPTS_FEATURE_KEY = 'search:external-scripts-config';
const DEFAULT_CONFIG: SearchExternalScriptsConfig = { scripts: [] };

function shouldLoadSearchScripts(pathname: string): boolean {
  return pathname.startsWith('/s/');
}

function isValidHttpUrl(url: unknown): url is string {
  return typeof url === 'string' && /^https?:\/\//.test(url);
}

function normalizeConfig(config: SearchExternalScriptsConfig): SearchExternalScriptItem[] {
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

export function SearchExternalScripts() {
  const router = useRouter();
  const config = useFeatureValue<SearchExternalScriptsConfig>(SEARCH_EXTERNAL_SCRIPTS_FEATURE_KEY, DEFAULT_CONFIG);
  const scripts = normalizeConfig(config);
  const shouldLoad = shouldLoadSearchScripts(router.pathname);

  if (!shouldLoad || scripts.length === 0) return null;

  return (
    <>
      {scripts.map((script, index) => (
        <Script key={script.id || `${script.src}-${index}`} id={script.id} src={script.src} strategy={script.strategy} />
      ))}
    </>
  );
}
