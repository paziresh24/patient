import type { NextApiRequest, NextApiResponse } from 'next';
import config from 'next/config';

const { publicRuntimeConfig } = config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (publicRuntimeConfig.NO_INDEX === 'true') return res.send(`User-agent: *\nDisallow: /`);
  return res.send('');
}
