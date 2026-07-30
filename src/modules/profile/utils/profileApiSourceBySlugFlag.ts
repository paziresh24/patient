import { GrowthBook, setPolyfills } from '@growthbook/growthbook-react';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { getProfileMicroserviceConfig } from '@/common/apis/clients/profileMicroserviceClient';
import getConfig from 'next/config';

export const PROFILE_API_SOURCE_FEATURE_KEY = 'profile.api-source-by-slug';

const DEFAULT_CONFIG = { slugs: [] as string[] };
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedConfig: { slugs: string[] } | null = null;
let cachedAt = 0;
let inflight: Promise<{ slugs: string[] }> | null = null;

async function fetchApiSourceSlugsFromGrowthBook(): Promise<{ slugs: string[] }> {
  const { publicRuntimeConfig } = getConfig() ?? {};
  const apiHost = publicRuntimeConfig?.GROWTHBOOK_API_HOST;
  const clientKey = publicRuntimeConfig?.GROWTHBOOK_CLIENT_KEY;
  if (!apiHost || !clientKey) return DEFAULT_CONFIG;

  try {
    setPolyfills({
      fetch: require('node-fetch'),
      EventSource: require('eventsource'),
      SubtleCrypto: require('node:crypto')?.webcrypto?.subtle,
    });
    const gb = new GrowthBook({ apiHost, clientKey });
    await gb.loadFeatures({ timeout: 2500 });
    const value = gb.getFeatureValue<{ slugs?: string[] }>(PROFILE_API_SOURCE_FEATURE_KEY, DEFAULT_CONFIG);
    if (value && Array.isArray(value.slugs)) {
      return { slugs: value.slugs.map(s => String(s)) };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error(`Error fetching ${PROFILE_API_SOURCE_FEATURE_KEY} from GrowthBook:`, error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Allowlist for microservice profile source.
 * Production: GrowthBook `profile.api-source-by-slug` only.
 * Optional local fallback: PROFILE_API_SOURCE_SLUGS (only used when GB returns empty).
 */
export async function getProfileApiSourceSlugs(): Promise<string[]> {
  if (cachedConfig && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedConfig.slugs;
  }

  if (!inflight) {
    inflight = fetchApiSourceSlugsFromGrowthBook()
      .then(config => {
        const { envSlugs } = getProfileMicroserviceConfig();
        // Prefer GrowthBook when it has any slugs; env is local fallback only.
        const slugs = config.slugs.length > 0 ? config.slugs : envSlugs;
        cachedConfig = { slugs };
        cachedAt = Date.now();
        return cachedConfig;
      })
      .finally(() => {
        inflight = null;
      });
  }

  const config = await inflight;
  return config.slugs;
}

export function isSlugInProfileApiSourceAllowlist(slugs: string[] | undefined, slug: string): boolean {
  return newApiFeatureFlaggingCondition(slugs ?? [], slug);
}

/** True when this slug should load identity/content from PROFILE_API_BASE_URL. */
export async function isProfileMicroserviceEnabledForSlug(slug: string): Promise<boolean> {
  const { baseURL } = getProfileMicroserviceConfig();
  if (!baseURL) return false;
  const slugs = await getProfileApiSourceSlugs();
  return isSlugInProfileApiSourceAllowlist(slugs, slug);
}
