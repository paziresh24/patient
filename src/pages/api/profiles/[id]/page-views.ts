import type { NextApiRequest, NextApiResponse } from 'next';
import { incrementProfilePageView } from '@/common/apis/services/profile-microservice/incrementProfilePageView';

const PROFILE_API_ID_RE = /^[\w-]{1,64}$/;

/**
 * BFF: browser must not hold PROFILE_API_TOKEN.
 * Proxies POST page-views to profiles-api for microservice profiles only.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawId = req.query.id;
  const profileApiId = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!profileApiId || !PROFILE_API_ID_RE.test(profileApiId)) {
    return res.status(400).json({ error: 'Invalid profile id' });
  }

  const terminalId =
    (typeof req.headers['x-terminal-id'] === 'string' && req.headers['x-terminal-id']) ||
    (typeof req.cookies?.terminal_id === 'string' ? req.cookies.terminal_id : null);
  const viewerUserId =
    (typeof req.headers['x-viewer-user-id'] === 'string' && req.headers['x-viewer-user-id']) || null;

  try {
    const data = await incrementProfilePageView(profileApiId, {
      terminalId,
      viewerUserId,
    });
    return res.status(200).json({ data });
  } catch (error: any) {
    const status = error?.response?.status ?? 502;
    const message = error?.response?.data?.message ?? error?.message ?? 'Failed to increment page view';
    return res.status(status >= 400 && status < 600 ? status : 502).json({ error: message });
  }
}
