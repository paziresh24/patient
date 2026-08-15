import { GrowthBook, setPolyfills } from '@growthbook/growthbook-react';
import { getProfileMicroserviceConfig } from '@/common/apis/clients/profileMicroserviceClient';
import {
  PROFILE_API_SOURCE_FEATURE_KEY,
  isSlugInProfileApiSourceAllowlist,
} from '@/modules/profile/utils/profileApiSourceBySlugFlag';
import getConfig from 'next/config';

type ApiSourceConfig = { slugs?: string[] };

const DEFAULT_CONFIG: ApiSourceConfig = { slugs: [] };
/** Same idea as expertise chips: do not tie allowlist to the 500ms profile GB load. */
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedConfig: ApiSourceConfig | null = null;
let cachedAt = 0;
let inflight: Promise<ApiSourceConfig> | null = null;

const getGrowthbookRuntime = () => {
  const { publicRuntimeConfig } = getConfig() ?? {};
  return {
    apiHost: publicRuntimeConfig?.GROWTHBOOK_API_HOST,
    clientKey: publicRuntimeConfig?.GROWTHBOOK_CLIENT_KEY,
  };
};

const fetchProfileApiSourceConfig = async (): Promise<ApiSourceConfig> => {
  const { apiHost, clientKey } = getGrowthbookRuntime();
  if (!apiHost || !clientKey) return DEFAULT_CONFIG;

  try {
    setPolyfills({
      fetch: require('node-fetch'),
      EventSource: require('eventsource'),
      SubtleCrypto: require('node:crypto')?.webcrypto?.subtle,
    });

    const gb = new GrowthBook({ apiHost, clientKey });
    await gb.loadFeatures({ timeout: 2500 });

    const value = gb.getFeatureValue<ApiSourceConfig>(PROFILE_API_SOURCE_FEATURE_KEY, DEFAULT_CONFIG);
    if (value && Array.isArray(value.slugs)) {
      return { slugs: value.slugs.map((item: unknown) => String(item)) };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error fetching profile.api-source-by-slug from GrowthBook:', error);
    if (cachedConfig?.slugs?.length) return cachedConfig;
    return DEFAULT_CONFIG;
  }
};

/** GrowthBook allowlist with in-process cache (source of truth stays GB — editable anytime). Server-only. */
export const getProfileApiSourceAllowlistConfig = async (): Promise<ApiSourceConfig> => {
  if (cachedConfig && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedConfig;
  }

  if (!inflight) {
    inflight = fetchProfileApiSourceConfig()
      .then(config => {
        if (config.slugs && config.slugs.length > 0) {
          cachedConfig = config;
          cachedAt = Date.now();
        } else if (cachedConfig?.slugs?.length) {
          return cachedConfig;
        } else {
          cachedConfig = config;
          cachedAt = Date.now();
        }
        return cachedConfig ?? config;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
};

export async function isProfileMicroserviceAllowlistedSlug(slug: string): Promise<boolean> {
  const { baseURL, envSlugs } = getProfileMicroserviceConfig();
  if (!baseURL) return false;

  const { slugs: gbSlugs } = await getProfileApiSourceAllowlistConfig();
  const slugs = gbSlugs && gbSlugs.length > 0 ? gbSlugs : envSlugs;
  return isSlugInProfileApiSourceAllowlist(slugs, slug);
}
