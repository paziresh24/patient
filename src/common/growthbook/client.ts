import { GrowthBook, configureCache } from '@growthbook/growthbook-react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const isEnabledGrowthbook =
  !!publicRuntimeConfig.GROWTHBOOK_API_HOST && !!publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY;

if (isEnabledGrowthbook) {
  configureCache({
    staleTTL: 30 * 1000,
  });
}

/** Leaf GrowthBook singleton — do not import from `pages/_app` (pulls Plasmic/app tree into SSG). */
export const growthbook = new GrowthBook({
  enabled: isEnabledGrowthbook,
  apiHost: publicRuntimeConfig.GROWTHBOOK_API_HOST,
  clientKey: publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY,
  backgroundSync: true,
  realtimeInterval: 10000,
});
