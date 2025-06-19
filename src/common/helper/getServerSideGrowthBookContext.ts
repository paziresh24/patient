import { setPolyfills } from '@growthbook/growthbook-react';
import { NextApiRequest } from 'next';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export function getServerSideGrowthBookContext(req: NextApiRequest) {
  // Set GrowthBook polyfills for server environments
  setPolyfills({
    fetch: require('node-fetch'),
    EventSource: require('eventsource'),
    SubtleCrypto: require('node:crypto')?.webcrypto?.subtle,
  });

  return {
    apiHost: publicRuntimeConfig.GROWTHBOOK_API_HOST,
    clientKey: publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY,
  };
}
