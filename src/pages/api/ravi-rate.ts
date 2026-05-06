import { raviApiClient } from '@/common/apis/client';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Browser-side calls to ravi-api are often blocked by CORS when running on local/staging origins.
 * This route proxies GET /ravi/v1/rate on the server (same origin from the browser).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const raw = req.query.slug;
  const slug = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : '';
  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' });
  }

  try {
    const { data } = await raviApiClient.get(`/ravi/v1/rate`, {
      params: {
        where: `(doctor_slug,eq,${slug})`,
      },
      timeout: 12_000,
    });
    return res.status(200).json(data);
  } catch (e: any) {
    const status = e?.response?.status ?? 502;
    return res.status(status).json({
      error: e?.message ?? 'Upstream error',
      detail: e?.response?.data,
    });
  }
}
