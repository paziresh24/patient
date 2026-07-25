import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { AccessToken } from 'livekit-server-sdk';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';
import { nanoid } from 'nanoid';

type SessionBody = {
  url: string;
  token: string;
  roomName: string;
};

function readCookie(req: NextApiRequest, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  const match = raw
    .split(';')
    .map(p => p.trim())
    .find(p => p.startsWith(`${name}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.slice(name.length + 1));
}

function clipString(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.slice(0, max);
}

function sanitizeValue(value: unknown, max = 500): string | string[] | undefined {
  if (typeof value === 'string') return value.slice(0, max);
  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === 'string')
      .slice(0, 20)
      .map(v => v.slice(0, max));
  }
  return undefined;
}

function sanitizeRecord(
  raw: unknown,
  maxKeys = 40,
): Record<string, string | string[]> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out: Record<string, string | string[]> = {};
  let n = 0;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (n >= maxKeys) break;
    if (typeof key !== 'string' || key.length > 80) continue;
    const cleaned = sanitizeValue(value);
    if (cleaned === undefined) continue;
    out[key] = cleaned;
    n += 1;
  }
  return out;
}

/** Accept generic ui context: url + route + query + dynamic params. */
function sanitizeUiContext(raw: unknown): Record<string, unknown> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  const url = clipString(o.url ?? o.path, 800);
  if (!url) return undefined;
  return {
    url,
    path: clipString(o.path, 500) || url.split('?')[0],
    route: clipString(o.route ?? o.pathname, 300) || '',
    query: sanitizeRecord(o.query) || {},
    params: sanitizeRecord(o.params) || {},
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'method_not_allowed' });
  }

  const { serverRuntimeConfig } = getConfig();
  const apiKey = serverRuntimeConfig.LIVEKIT_API_KEY || process.env.LIVEKIT_API_KEY;
  const apiSecret = serverRuntimeConfig.LIVEKIT_API_SECRET || process.env.LIVEKIT_API_SECRET;
  const livekitUrl = serverRuntimeConfig.LIVEKIT_URL || process.env.LIVEKIT_URL;
  const agentName =
    serverRuntimeConfig.VOICE_AGENT_NAME || process.env.VOICE_AGENT_NAME || 'doctor-secretary';

  if (!apiKey || !apiSecret || !livekitUrl) {
    return res.status(503).json({ message: 'voice_not_configured' });
  }

  const token = readCookie(req, 'token');
  if (!token) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  const hamiToken = readCookie(req, 'hami-token');
  const gozargahToken = readCookie(req, 'gozargah_token');
  const roomName = `doctor-voice-${nanoid(10)}`;
  const identity = `doctor-${nanoid(8)}`;

  const uiContext = sanitizeUiContext(req.body?.uiContext);

  const panelMeta = JSON.stringify({
    token,
    ...(hamiToken ? { hami_token: hamiToken } : {}),
    ...(gozargahToken ? { gozargah_token: gozargahToken } : {}),
    ...(uiContext ? { ui_context: uiContext } : {}),
  });

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: 'پزشک',
      metadata: panelMeta,
      ttl: '10m',
    });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    at.roomConfig = new RoomConfiguration({
      agents: [
        new RoomAgentDispatch({
          agentName,
          metadata: panelMeta,
        }),
      ],
    });

    const jwt = await at.toJwt();
    const body: SessionBody = {
      url: livekitUrl,
      token: jwt,
      roomName,
    };
    return res.status(200).json(body);
  } catch (err) {
    console.error('[voice/session]', err instanceof Error ? err.message : 'token_failed');
    return res.status(500).json({ message: 'token_failed' });
  }
}
