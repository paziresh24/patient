import classNames from '@/common/utils/classNames';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Drawer } from 'vaul';
import { AgentAudioVisualizerAura } from '../agents-ui/agent-audio-visualizer-aura';
import { CallAudioFx } from '../audio/callAudioFx';
import { formatCallTimer } from '../hooks/useVoiceCall';
import { useAgentUiSurfaceStore } from '../store/agentUiSurface';
import { useVoiceCallUiStore } from '../store/voiceCallUi';
import {
  WsVoiceSession,
  type WsVoiceStatus,
} from '../transport/wsVoiceSession';
import type { AgentUiPrompt, AgentUiReply } from '../ui-surface/types';
import { AgentUiSurfaceHost } from './AgentUiSurfaceHost';

function CallControl({
  label,
  onClick,
  tone = 'neutral',
  active = false,
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: 'neutral' | 'danger';
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={classNames(
        'flex h-14 w-14 items-center justify-center rounded-full transition-[transform,background-color] duration-150 ease-out',
        'active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400',
        tone === 'danger' && 'bg-[#ef4444] text-white',
        tone === 'neutral' && !active && 'bg-slate-100 text-slate-700',
        tone === 'neutral' && active && 'bg-slate-900 text-white',
      )}
    >
      {children}
    </button>
  );
}

function useCallTimer(running: boolean) {
  const [elapsedSec, setElapsedSec] = useState(0);
  useEffect(() => {
    if (!running) {
      setElapsedSec(0);
      return;
    }
    setElapsedSec(0);
    const startedAt = Date.now();
    const id = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [running]);
  return elapsedSec;
}

function statusToAura(status: WsVoiceStatus): 'connecting' | 'listening' | 'speaking' | 'thinking' | 'disconnected' {
  if (status === 'speaking') return 'speaking';
  if (status === 'listening') return 'listening';
  if (status === 'thinking') return 'thinking';
  if (status === 'connecting') return 'connecting';
  return 'disconnected';
}

function CallSheetBody({
  onEnd,
  elapsedSec,
  connected,
  muted,
  onToggleMute,
  auraState,
  agentVolume,
  onUiReply,
}: {
  onEnd: () => void;
  elapsedSec: number;
  connected: boolean;
  muted: boolean;
  onToggleMute: () => void;
  auraState: ReturnType<typeof statusToAura>;
  agentVolume: number;
  onUiReply: (reply: AgentUiReply) => void;
}) {
  const hasPrompt = useAgentUiSurfaceStore(s => Boolean(s.prompt));

  return (
    <div className="flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/voice-agent/arash.png?v=9"
              alt="آرش"
              className="h-full w-full object-cover"
              style={{ objectPosition: '50% 12%' }}
              draggable={false}
            />
          </div>
          <p className="text-[16px] font-semibold leading-tight text-slate-900">آرش</p>
        </div>
        {connected ? (
          <p className="tabular-nums text-[15px] font-medium tracking-wide text-slate-500" dir="ltr">
            {formatCallTimer(elapsedSec)}
          </p>
        ) : (
          <span className="w-12" aria-hidden />
        )}
      </div>

      {hasPrompt ? (
        <div className="mt-3 flex min-h-0 flex-1 flex-col">
          <AgentUiSurfaceHost onReply={onUiReply} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <AgentAudioVisualizerAura
            size="lg"
            color="#60A5FA"
            colorShift={0.12}
            state={auraState}
            themeMode="light"
            audioTrack={undefined}
            volume={auraState === 'speaking' ? agentVolume : 0}
            className="mx-auto"
          />
        </div>
      )}

      <div className="flex shrink-0 items-center justify-center gap-10 pb-1 pt-2">
        <CallControl
          label={muted ? 'صدا باز' : 'بی‌صدا'}
          onClick={onToggleMute}
          active={muted}
        >
          {muted ? <MicOff size={22} strokeWidth={1.75} /> : <Mic size={22} strokeWidth={1.75} />}
        </CallControl>
        <CallControl label="قطع" onClick={onEnd} tone="danger">
          <PhoneOff size={22} strokeWidth={1.75} className="translate-y-px" />
        </CallControl>
      </div>
    </div>
  );
}

function CallEndedBody() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
      <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/voice-agent/arash.png?v=9"
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: '50% 12%' }}
          draggable={false}
        />
      </div>
      <p className="text-[18px] font-semibold text-slate-900">تماس پایان یافت</p>
    </div>
  );
}

function ConnectingBody({
  error,
  onRetry,
  onClose,
}: {
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
      <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/voice-agent/arash.png?v=9"
          alt="آرش"
          className="h-full w-full object-cover"
          style={{ objectPosition: '50% 12%' }}
          draggable={false}
        />
      </div>
      <div>
        <p className="text-[18px] font-semibold text-slate-900">آرش</p>
        {error ? (
          <p className="mt-1 text-[14px] text-red-500">
            {error === 'unauthorized'
              ? 'وارد حساب کاربری شوید و دوباره تلاش کنید'
              : error === 'Failed to fetch' || error.includes('fetch') || error.includes('ارتباط')
                ? 'ارتباط با سرویس تماس برقرار نشد'
                : 'تماس برقرار نشد'}
          </p>
        ) : (
          <p className="mt-1 text-[14px] text-slate-500">در حال برقراری تماس…</p>
        )}
        {error && error !== 'unauthorized' && !error.includes('fetch') && !error.includes('ارتباط') ? (
          <p className="mt-1 max-w-[16rem] text-[12px] text-slate-400 break-all" dir="ltr">
            {error}
          </p>
        ) : null}
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-slate-100 px-5 py-2.5 text-[14px] font-medium text-slate-800 active:scale-[0.97]"
          >
            تلاش مجدد
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-red-500 px-5 py-2.5 text-[14px] font-medium text-white active:scale-[0.97]"
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Call UI over WebSocket PCM (no LiveKit).
 * Dismissing the sheet minimizes; only hang-up ends the session.
 */
export function CallOverlay() {
  const active = useVoiceCallUiStore(s => s.active);
  const expanded = useVoiceCallUiStore(s => s.expanded);
  const ending = useVoiceCallUiStore(s => s.ending);
  const expandCall = useVoiceCallUiStore(s => s.expandCall);
  const minimizeCall = useVoiceCallUiStore(s => s.minimizeCall);
  const beginEnding = useVoiceCallUiStore(s => s.beginEnding);
  const endCall = useVoiceCallUiStore(s => s.endCall);
  const setSessionStatus = useVoiceCallUiStore(s => s.setSessionStatus);
  const setStoreAgentVolume = useVoiceCallUiStore(s => s.setAgentVolume);

  const [status, setStatus] = useState<WsVoiceStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [agentVolume, setAgentVolume] = useState(0);
  const sessionRef = useRef<WsVoiceSession | null>(null);
  const fxRef = useRef<CallAudioFx | null>(null);
  const beginEndingRef = useRef(beginEnding);
  const endCallRef = useRef(endCall);
  beginEndingRef.current = beginEnding;
  endCallRef.current = endCall;

  const connected = status === 'listening' || status === 'speaking' || status === 'thinking';
  const elapsedSec = useCallTimer(connected && !ending);
  const hasPrompt = useAgentUiSurfaceStore(s => Boolean(s.prompt));

  useEffect(() => {
    setSessionStatus(status);
  }, [status, setSessionStatus]);

  useEffect(() => {
    setStoreAgentVolume(agentVolume);
  }, [agentVolume, setStoreAgentVolume]);

  useEffect(() => {
    if (hasPrompt && active && !expanded && !ending) expandCall();
  }, [hasPrompt, active, expanded, ending, expandCall]);

  useEffect(() => {
    if (!active) return;
    const fx = new CallAudioFx();
    fxRef.current = fx;
    return () => {
      if (fxRef.current !== fx) return;
      fxRef.current = null;
      fx.playDisconnectedIfConnected();
      window.setTimeout(() => fx.dispose(), 800);
    };
  }, [active]);

  useEffect(() => {
    if (connected && !ending) fxRef.current?.playConnected();
  }, [connected, ending]);

  useEffect(() => {
    if (ending) fxRef.current?.playDisconnectedIfConnected();
  }, [ending]);

  useEffect(() => {
    if (!active) {
      sessionRef.current?.disconnect({ notifyClosed: false });
      sessionRef.current = null;
      setStatus('idle');
      setError(null);
      setMuted(false);
      setAgentVolume(0);
      setSessionStatus('idle');
      setStoreAgentVolume(0);
      return;
    }

    let cancelled = false;
    setError(null);
    setStatus('connecting');
    setSessionStatus('connecting');
    setMuted(false);
    setAgentVolume(0);
    setStoreAgentVolume(0);

    const session = new WsVoiceSession({
      onStatus: next => {
        if (cancelled) return;
        if (next === 'closed') {
          beginEndingRef.current();
          window.setTimeout(() => endCallRef.current(), 1400);
          return;
        }
        setStatus(next);
      },
      onError: message => {
        if (cancelled) return;
        setError(message);
        setStatus('error');
      },
      onShowUi: prompt => {
        if (cancelled || !prompt || typeof prompt !== 'object') return;
        useAgentUiSurfaceStore.getState().setPrompt(prompt as AgentUiPrompt);
      },
      onHideUi: () => {
        if (cancelled) return;
        useAgentUiSurfaceStore.getState().clearPrompt();
      },
      onAgentVolume: vol => {
        if (cancelled) return;
        setAgentVolume(vol);
      },
    });
    sessionRef.current = session;
    void session.connect();

    return () => {
      cancelled = true;
      // Don't notify closed on React cleanup (Strict Mode / Fast Refresh) —
      // only intentional hangup or real socket death should end the call UI.
      session.disconnect({ notifyClosed: false });
      if (sessionRef.current === session) sessionRef.current = null;
    };
    // intentionally omit beginEnding/endCall — use refs so store identity
    // changes don't tear down the live WebSocket.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, attempt]);

  const hangUp = () => {
    beginEnding();
    sessionRef.current?.disconnect({ notifyClosed: false });
    sessionRef.current = null;
    window.setTimeout(() => endCall(), 1400);
  };

  const toggleMute = () => {
    const session = sessionRef.current;
    if (!session) return;
    const next = !muted;
    session.setMuted(next);
    setMuted(next);
  };

  const onUiReply = (reply: AgentUiReply) => {
    sessionRef.current?.sendUiReply(reply);
  };

  if (!active) return null;

  const showConnecting = !connected && !ending && (status === 'connecting' || status === 'error' || status === 'idle');

  if (showConnecting) {
    return (
      <Drawer.Root
        open={expanded}
        onOpenChange={next => {
          if (!next) {
            hangUp();
          }
        }}
        modal
        dismissible
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/40" />
          <Drawer.Content
            className="fixed inset-x-0 bottom-0 z-[101] flex h-[50dvh] max-h-[50dvh] flex-col rounded-t-[24px] bg-white outline-none"
            dir="rtl"
          >
            <div className="flex shrink-0 justify-center pt-3 pb-1">
              <Drawer.Handle className="!h-1 !w-10 !rounded-full !bg-slate-200" />
            </div>
            <Drawer.Title className="sr-only">تماس با آرش</Drawer.Title>
            <ConnectingBody
              error={error}
              onRetry={() => setAttempt(a => a + 1)}
              onClose={hangUp}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  const sheetOpen = expanded || ending;
  const auraState = statusToAura(status);

  // Sheet closed while call lives — FAB is minimized chrome; keep session via effects.
  if (!sheetOpen) return null;

  return (
    <Drawer.Root
      open
      onOpenChange={next => {
        // Keep sheet open while a prompt is visible — dismissing would hide choices.
        if (!next && !ending && !hasPrompt) minimizeCall();
      }}
      modal
      dismissible={!ending && !hasPrompt}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/40" />
        <Drawer.Content
          className={classNames(
            'fixed inset-x-0 bottom-0 z-[101] flex flex-col rounded-t-[24px] bg-white outline-none',
            hasPrompt ? 'h-[min(72dvh,36rem)] max-h-[72dvh]' : 'h-[50dvh] max-h-[50dvh]',
          )}
          dir="rtl"
        >
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <Drawer.Handle className="!h-1 !w-10 !rounded-full !bg-slate-200" />
          </div>
          <Drawer.Title className="sr-only">تماس با آرش</Drawer.Title>
          <Drawer.Description className="sr-only">دستیار صوتی پذیرش۲۴</Drawer.Description>
          {ending ? (
            <CallEndedBody />
          ) : (
            <CallSheetBody
              onEnd={hangUp}
              elapsedSec={elapsedSec}
              connected={connected}
              muted={muted}
              onToggleMute={toggleMute}
              auraState={auraState}
              agentVolume={agentVolume}
              onUiReply={onUiReply}
            />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
