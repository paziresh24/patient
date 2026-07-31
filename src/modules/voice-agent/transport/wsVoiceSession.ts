import { getCookie, setCookie } from 'cookies-next';
import getConfig from 'next/config';
import { refresh } from '@/common/apis/services/auth/refresh';

const MIC_SAMPLE_RATE = 16000;
const TTS_SAMPLE_RATE = 24000;
const MIC_CHUNK = 4096;
/** Local barge gate — keep low; browser AEC attenuates mic while TTS plays. */
const BARGE_IN_THRESHOLD = 0.02;
const GREETING_BARGE_IN_THRESHOLD = 0.045;
const BARGE_IN_FRAMES = 3;
const GREETING_BARGE_IN_FRAMES = 5;
/** Bridge gaps between TTS PCM chunks so agentTurn doesn't drop mid-utterance. */
const AGENT_TURN_TAIL_MS = 900;

export type WsVoiceStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'thinking'
  | 'error'
  | 'closed';

export type WsVoiceCallbacks = {
  onStatus?: (status: WsVoiceStatus) => void;
  onError?: (message: string) => void;
  onShowUi?: (prompt: unknown) => void;
  onHideUi?: () => void;
  /** Agent playback level 0..1 for Aura (no LiveKit track). */
  onAgentVolume?: (volume: number) => void;
};

function voiceApiBaseUrl(): string {
  const { publicRuntimeConfig } = getConfig();
  const base = (publicRuntimeConfig?.VOICE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
  if (!base) throw new Error('voice_api_not_configured');
  return base;
}

/** Public WSS endpoint for Arash (same host as VOICE_API_BASE_URL). */
export function resolveVoiceWsUrl(): string {
  const httpBase = voiceApiBaseUrl();
  const u = new URL(httpBase.startsWith('http') ? httpBase : `https://${httpBase}`);
  u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
  u.pathname = '/api/voice/ws';
  u.search = '';
  u.hash = '';
  return u.toString();
}

function readPanelCookies(): { token?: string; hamiToken?: string; gozargahToken?: string } {
  const token = getCookie('token');
  const hamiToken = getCookie('hami-token');
  const gozargahToken = getCookie('gozargah_token');
  return {
    ...(typeof token === 'string' && token ? { token } : {}),
    ...(typeof hamiToken === 'string' && hamiToken ? { hamiToken } : {}),
    ...(typeof gozargahToken === 'string' && gozargahToken ? { gozargahToken } : {}),
  };
}

/** Prefer readable cookie; if missing, refresh session (sets token cookie). */
async function ensurePanelCookies(): Promise<ReturnType<typeof readPanelCookies>> {
  let cookies = readPanelCookies();
  if (cookies.token) return cookies;
  try {
    const { data } = (await refresh()) as { data?: { access_token?: string } };
    const access = data?.access_token;
    if (typeof access === 'string' && access) {
      setCookie('token', access);
      cookies = readPanelCookies();
    }
  } catch {
    // Same-origin WSS still forwards Cookie on upgrade; continue without JS token.
  }
  return cookies;
}

class PcmStreamPlayer {
  private readonly pcmSampleRate: number;
  private ctx: AudioContext | null = null;
  private nextTime = 0;
  interrupted = false;
  private pending: Int16Array[] = [];
  private pendingSamples = 0;
  private readonly minPrebufferSamples: number;
  private readonly batchSamples: number;
  private playoutStarted = false;
  private activeSources = new Set<AudioBufferSourceNode>();
  /** Rough 0..1 level of the last enqueued PCM batch (for Aura). */
  lastLevel = 0;

  constructor(pcmSampleRate = TTS_SAMPLE_RATE) {
    this.pcmSampleRate = pcmSampleRate;
    this.minPrebufferSamples = Math.floor(pcmSampleRate * 0.08);
    this.batchSamples = Math.floor(pcmSampleRate * 0.06);
  }

  private ensureCtx() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.nextTime = this.ctx.currentTime + 0.05;
  }

  beginUtterance() {
    this.interrupted = false;
    this.pending = [];
    this.pendingSamples = 0;
    this.playoutStarted = false;
    if (this.ctx) this.nextTime = this.ctx.currentTime + 0.05;
  }

  reset() {
    this.stopAllSources();
    void this.ctx?.close();
    this.ctx = null;
    this.nextTime = 0;
    this.interrupted = false;
    this.pending = [];
    this.pendingSamples = 0;
    this.playoutStarted = false;
  }

  private stopAllSources() {
    for (const source of Array.from(this.activeSources)) {
      try {
        source.stop();
      } catch {
        /* ignore */
      }
    }
    this.activeSources.clear();
  }

  interrupt() {
    this.interrupted = true;
    this.stopAllSources();
    this.pending = [];
    this.pendingSamples = 0;
    this.playoutStarted = false;
    if (this.ctx) this.nextTime = this.ctx.currentTime;
  }

  isPlaying() {
    if (this.interrupted) return false;
    if (this.pendingSamples > 0) return true;
    if (this.activeSources.size > 0) return true;
    if (!this.ctx) return false;
    return this.nextTime > this.ctx.currentTime + 0.05;
  }

  enqueuePcm16(buffer: ArrayBuffer) {
    if (this.interrupted) return;
    const pcm = new Int16Array(buffer);
    if (!pcm.length) return;
    let sum = 0;
    for (let i = 0; i < pcm.length; i++) {
      const v = pcm[i] / 32768;
      sum += v * v;
    }
    this.lastLevel = Math.min(1, Math.sqrt(sum / pcm.length) * 4);
    this.pending.push(pcm);
    this.pendingSamples += pcm.length;
    this.flush(false);
  }

  endUtterance() {
    this.flush(true);
  }

  private flush(force: boolean) {
    if (this.interrupted) return;
    if (!force && !this.playoutStarted && this.pendingSamples < this.minPrebufferSamples) return;
    if (!force && this.playoutStarted && this.pendingSamples < this.batchSamples) return;
    if (!this.pendingSamples) return;

    this.playoutStarted = true;
    this.ensureCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') void this.ctx.resume();

    const merged = new Int16Array(this.pendingSamples);
    let offset = 0;
    for (const chunk of this.pending) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    this.pending = [];
    this.pendingSamples = 0;

    const floats = new Float32Array(merged.length);
    for (let i = 0; i < merged.length; i++) floats[i] = merged[i] / 32768;

    const audioBuffer = this.ctx.createBuffer(1, floats.length, this.pcmSampleRate);
    audioBuffer.copyToChannel(floats, 0);

    const source = this.ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.ctx.destination);
    this.activeSources.add(source);
    source.onended = () => this.activeSources.delete(source);

    const startAt = Math.max(this.nextTime, this.ctx.currentTime + 0.02);
    source.start(startAt);
    this.nextTime = startAt + audioBuffer.duration;
  }
}

/**
 * Browser ↔ Arash WebSocket voice session (PCM in/out, no LiveKit).
 */
export class WsVoiceSession {
  private readonly callbacks: WsVoiceCallbacks;
  private ws: WebSocket | null = null;
  private stream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private readonly player = new PcmStreamPlayer();
  private active = false;
  private awaitingGreeting = true;
  private greetingPlayback = true;
  private agentTurn = false;
  private bargeInFrames = 0;
  private agentQuietMs = 0;
  private ttsFlushTimer: ReturnType<typeof setTimeout> | null = null;
  private muted = false;

  constructor(callbacks: WsVoiceCallbacks = {}) {
    this.callbacks = callbacks;
  }

  get isMuted() {
    return this.muted;
  }

  setMuted(next: boolean) {
    this.muted = next;
    this.stream?.getAudioTracks().forEach(t => {
      t.enabled = !next;
    });
  }

  sendUiReply(reply: Record<string, unknown>) {
    this.sendControl({ type: 'agent_ui_reply', ...reply });
  }

  private sendControl(payload: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  private handleJsonMessage(data: Record<string, unknown>) {
    const type = data.type;
    if (type === 'user_speech_start') {
      if (this.agentTurn) this.agentTurn = false;
      this.player.interrupt();
      this.player.lastLevel = 0;
      this.callbacks.onAgentVolume?.(0);
      this.callbacks.onStatus?.('listening');
      return;
    }
    if (type === 'user_speech_end') {
      // User finished talking — LLM/tools are next.
      if (!this.agentTurn) this.callbacks.onStatus?.('thinking');
      return;
    }
    if (type === 'transcription') {
      if (data.final === false) return;
      // Final transcript before reply → thinking (unless already speaking).
      if (!this.agentTurn && !this.player.isPlaying()) {
        this.callbacks.onStatus?.('thinking');
      }
      return;
    }
    if (type === 'error') {
      this.callbacks.onError?.(String(data.error || 'خطا'));
      if (data.fatal) this.disconnect();
      else this.callbacks.onStatus?.('listening');
      return;
    }
    if (type === 'llm_response') {
      const starting = this.awaitingGreeting || !this.agentTurn;
      this.awaitingGreeting = false;
      this.agentTurn = true;
      this.agentQuietMs = 0;
      this.bargeInFrames = 0;
      if (starting) this.player.beginUtterance();
      this.callbacks.onStatus?.('speaking');
      return;
    }
    if (type === 'tool_status' || type === 'tool_call_request') {
      this.callbacks.onStatus?.('thinking');
      return;
    }
    if (type === 'show_ui') {
      this.callbacks.onShowUi?.(data.prompt ?? data);
      return;
    }
    if (type === 'hide_ui') {
      this.callbacks.onHideUi?.();
      return;
    }
  }

  private endAgentTurn(reason: 'quiet' | 'barge') {
    this.agentTurn = false;
    this.bargeInFrames = 0;
    this.greetingPlayback = false;
    this.player.lastLevel = 0;
    this.callbacks.onAgentVolume?.(0);
    this.callbacks.onStatus?.('listening');
  }

  private startMic() {
    if (!this.audioCtx || !this.stream) return;
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.processor = this.audioCtx.createScriptProcessor(MIC_CHUNK, 1, 1);
    this.processor.onaudioprocess = event => {
      if (!this.active || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      if (this.muted) return;
      if (this.awaitingGreeting && !this.player.isPlaying()) return;

      const channel = event.inputBuffer.getChannelData(0);
      let sum = 0;
      for (let i = 0; i < channel.length; i++) sum += channel[i] * channel[i];
      const rms = Math.sqrt(sum / channel.length);
      const chunkMs = (channel.length / MIC_SAMPLE_RATE) * 1000;

      const bargeThreshold = this.greetingPlayback ? GREETING_BARGE_IN_THRESHOLD : BARGE_IN_THRESHOLD;
      const bargeFrames = this.greetingPlayback ? GREETING_BARGE_IN_FRAMES : BARGE_IN_FRAMES;

      if (this.agentTurn) {
        const playing = this.player.isPlaying();
        if (playing) {
          this.agentQuietMs = 0;
          this.callbacks.onAgentVolume?.(this.player.lastLevel);
        } else {
          this.agentQuietMs += chunkMs;
          this.callbacks.onAgentVolume?.(0);
          if (this.agentQuietMs > AGENT_TURN_TAIL_MS) {
            this.endAgentTurn('quiet');
          }
        }

        if (playing) {
          if (rms >= bargeThreshold) this.bargeInFrames++;
          else this.bargeInFrames = 0;
        }

        if (playing && this.bargeInFrames >= bargeFrames) {
          this.player.interrupt();
          this.endAgentTurn('barge');
          this.sendControl({ type: 'barge_in_confirmed' });
          // Fall through so this frame's mic audio reaches the server.
        } else if (playing && !this.greetingPlayback) {
          return;
        }
      }

      const int16 = new Int16Array(channel.length);
      for (let i = 0; i < channel.length; i++) {
        const s = Math.max(-1, Math.min(1, channel[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.ws.send(int16.buffer);
    };
    source.connect(this.processor);
    const silent = this.audioCtx.createGain();
    silent.gain.value = 0;
    this.processor.connect(silent);
    silent.connect(this.audioCtx.destination);
  }

  async connect() {
    this.callbacks.onStatus?.('connecting');
    try {
      // Token may be missing from document.cookie (httpOnly / refresh flow).
      // Prefer JS cookie + refresh; WS upgrade still forwards Cookie via patient proxy.
      const cookies = await ensurePanelCookies();

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: MIC_SAMPLE_RATE,
        },
      });
      this.audioCtx = new AudioContext({ sampleRate: MIC_SAMPLE_RATE });
      this.ws = new WebSocket(resolveVoiceWsUrl());
      this.ws.binaryType = 'arraybuffer';
      this.active = true;
      this.awaitingGreeting = true;
      this.greetingPlayback = true;
      this.agentTurn = false;

      this.ws.onopen = () => {
        this.ws?.send(
          JSON.stringify({
            type: 'session_start',
            locale: 'fa-IR',
            cookies,
            mode: 'vad',
          }),
        );
        this.sendControl({ type: 'mode', mode: 'vad' });
        this.callbacks.onStatus?.('connecting');
        this.startMic();
      };

      this.ws.onmessage = async ev => {
        if (typeof ev.data === 'string') {
          try {
            this.handleJsonMessage(JSON.parse(ev.data) as Record<string, unknown>);
          } catch {
            /* ignore */
          }
          return;
        }

        const buf =
          ev.data instanceof ArrayBuffer
            ? ev.data
            : ev.data instanceof Blob
              ? await ev.data.arrayBuffer()
              : null;
        if (!buf) return;

        const starting = this.awaitingGreeting || !this.agentTurn;
        if (starting) {
          this.awaitingGreeting = false;
          this.agentTurn = true;
          this.player.beginUtterance();
          this.callbacks.onStatus?.('speaking');
        }
        if (!this.player.interrupted) {
          this.player.enqueuePcm16(buf);
          if (this.ttsFlushTimer) clearTimeout(this.ttsFlushTimer);
          this.ttsFlushTimer = setTimeout(() => this.player.endUtterance(), 120);
        }
      };

      this.ws.onerror = () => {
        if (!this.active) return;
        this.callbacks.onError?.('ارتباط با سرویس تماس برقرار نشد');
        this.callbacks.onStatus?.('error');
        this.teardownMedia({ notifyClosed: false });
      };

      this.ws.onclose = () => {
        if (!this.active) return;
        this.teardownMedia({ notifyClosed: true });
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'call_failed';
      this.callbacks.onStatus?.('error');
      this.callbacks.onError?.(message);
      this.teardownMedia({ notifyClosed: false });
    }
  }

  /** Stop mic/WS without necessarily signaling a normal hangup. */
  private teardownMedia({ notifyClosed }: { notifyClosed: boolean }) {
    const wasActive = this.active;
    this.active = false;
    if (this.ttsFlushTimer) clearTimeout(this.ttsFlushTimer);
    this.ttsFlushTimer = null;
    try {
      this.processor?.disconnect();
    } catch {
      /* ignore */
    }
    this.processor = null;
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    void this.audioCtx?.close();
    this.audioCtx = null;
    const ws = this.ws;
    this.ws = null;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    }
    this.player.reset();
    if (wasActive && notifyClosed) this.callbacks.onStatus?.('closed');
  }

  disconnect(opts?: { notifyClosed?: boolean }) {
    this.teardownMedia({ notifyClosed: opts?.notifyClosed !== false });
  }
}
