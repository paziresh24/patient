import { GrowthBook, setPolyfills } from '@growthbook/growthbook-react';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

type ExpertiseChipsConfig = { slugs?: string[] };

const DEFAULT_CONFIG: ExpertiseChipsConfig = { slugs: [] };
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedConfig: ExpertiseChipsConfig | null = null;
let cachedAt = 0;
let inflight: Promise<ExpertiseChipsConfig> | null = null;

const fetchExpertiseChipsConfig = async (): Promise<ExpertiseChipsConfig> => {
  const apiHost = publicRuntimeConfig.GROWTHBOOK_API_HOST;
  const clientKey = publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY;
  if (!apiHost || !clientKey) return DEFAULT_CONFIG;

  try {
    // Use GrowthBook SDK (not raw REST) so rule-based values are evaluated correctly.
    // Dedicated load (timeout 2500) — do not fold into the short profile SSR GB load,
    // or gradual allowlist/percentage rollout can mis-evaluate under 500ms timeout.
    setPolyfills({
      fetch: require('node-fetch'),
      EventSource: require('eventsource'),
      SubtleCrypto: require('node:crypto')?.webcrypto?.subtle,
    });

    const gb = new GrowthBook({ apiHost, clientKey });
    await gb.loadFeatures({ timeout: 2500 });

    const value = gb.getFeatureValue<ExpertiseChipsConfig>(
      'profile.expertise-chips-like-search',
      DEFAULT_CONFIG,
    );

    if (value && Array.isArray(value.slugs)) {
      return { slugs: value.slugs.map((slug: unknown) => String(slug)) };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error fetching profile.expertise-chips-like-search from GrowthBook:', error);
    return DEFAULT_CONFIG;
  }
};

export const getExpertiseChipsLikeSearchConfig = async (): Promise<ExpertiseChipsConfig> => {
  if (cachedConfig && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedConfig;
  }

  if (!inflight) {
    inflight = fetchExpertiseChipsConfig()
      .then(config => {
        cachedConfig = config;
        cachedAt = Date.now();
        return config;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
};

export const isExpertiseChipsLikeSearchEnabledForSlug = async (slug: string): Promise<boolean> => {
  const config = await getExpertiseChipsLikeSearchConfig();
  return newApiFeatureFlaggingCondition(config.slugs ?? [], slug);
};
