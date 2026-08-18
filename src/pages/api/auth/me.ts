import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { authMeUpstreamUrl, pickAuthMeForwardHeaders } from '@/common/apis/services/auth/auth-me-proxy';

function configGatewayBase(): string | undefined {
  try {
    const { publicRuntimeConfig, serverRuntimeConfig } = getConfig() || {};
    return serverRuntimeConfig?.API_GATEWAY_BASE_URL || publicRuntimeConfig?.API_GATEWAY_BASE_URL;
  } catch {
    return undefined;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }

  const tz = req.headers['accept-timezone'];
  const upstream = await fetch(authMeUpstreamUrl(configGatewayBase()), {
    method: 'GET',
    headers: pickAuthMeForwardHeaders({
      authorization: typeof req.headers.authorization === 'string' ? req.headers.authorization : undefined,
      cookie: typeof req.headers.cookie === 'string' ? req.headers.cookie : undefined,
      acceptTimezone: typeof tz === 'string' ? tz : undefined,
    }),
    redirect: 'manual',
  });

  const body = await upstream.text();
  const contentType = upstream.headers.get('content-type');
  if (contentType) res.setHeader('Content-Type', contentType);
  return res.status(upstream.status).send(body);
}
