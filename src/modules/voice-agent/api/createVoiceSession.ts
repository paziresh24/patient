import getConfig from 'next/config';
import { getCookie } from 'cookies-next';
import type { UiContext } from '../context/uiContext';

export type VoiceSession = {
  url: string;
  token: string;
  roomName?: string;
};

function voiceApiBaseUrl(): string {
  const { publicRuntimeConfig } = getConfig();
  const base = (publicRuntimeConfig?.VOICE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
  if (!base) {
    throw new Error('voice_api_not_configured');
  }
  return base;
}

/** Mint a LiveKit join token from the voice-agent session service (no secrets in patient). */
export async function createVoiceSession(uiContext?: UiContext): Promise<VoiceSession> {
  const token = getCookie('token');
  if (!token || typeof token !== 'string') {
    throw new Error('unauthorized');
  }

  const hamiToken = getCookie('hami-token');
  const gozargahToken = getCookie('gozargah_token');

  const res = await fetch(`${voiceApiBaseUrl()}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uiContext,
      ...(typeof hamiToken === 'string' && hamiToken ? { hamiToken } : {}),
      ...(typeof gozargahToken === 'string' && gozargahToken ? { gozargahToken } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.detail;
    const message =
      (typeof detail === 'string' && detail) ||
      (typeof body?.message === 'string' && body.message) ||
      `session_${res.status}`;
    throw new Error(message);
  }

  return (await res.json()) as VoiceSession;
}
