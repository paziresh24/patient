import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { serverRuntimeConfig } = getConfig();
  const configured = Boolean(
    (serverRuntimeConfig.LIVEKIT_API_KEY || process.env.LIVEKIT_API_KEY) &&
      (serverRuntimeConfig.LIVEKIT_API_SECRET || process.env.LIVEKIT_API_SECRET) &&
      (serverRuntimeConfig.LIVEKIT_URL || process.env.LIVEKIT_URL),
  );
  return res.status(200).json({
    ok: true,
    service: 'doctor-voice',
    configured,
  });
}
