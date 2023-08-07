import { setPolyfills } from '@growthbook/growthbook-react';
import { NextApiRequest } from 'next';

export function getServerSideGrowthBookContext(req: NextApiRequest) {
  // Set GrowthBook polyfills for server environments
  setPolyfills({
    fetch: globalThis.fetch || require('node:fetch'),
    EventSource: globalThis.EventSource || require('eventsource'),
    SubtleCrypto: globalThis.crypto?.subtle || require('node:crypto')?.webcrypto?.subtle,
  });

  return {
    apiHost: process.env.GROWTHBOOK_API_HOST,
    clientKey: process.env.GROWTHBOOK_CLIENT_KEY,
  };
}
