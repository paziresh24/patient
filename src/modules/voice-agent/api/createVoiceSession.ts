import getConfig from 'next/config';
import { resolveVoiceWsUrl } from '../transport/wsVoiceSession';

export type VoiceSession = {
  /** WebSocket URL for PCM voice (wss://…). */
  url: string;
  /** LiveKit JWT when using LK transport; omitted for WSS Arash. */
  token?: string;
};

function voiceApiBaseUrl(): string {
  const { publicRuntimeConfig } = getConfig();
  const base = (publicRuntimeConfig?.VOICE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
  if (!base) {
    throw new Error('voice_api_not_configured');
  }
  return base;
}

/** Resolve Arash voice WebSocket URL (no LiveKit token). */
export async function createVoiceSession(): Promise<VoiceSession> {
  voiceApiBaseUrl(); // throws if unset
  return { url: resolveVoiceWsUrl() };
}
