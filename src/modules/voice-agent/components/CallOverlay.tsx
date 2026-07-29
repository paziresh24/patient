import '@livekit/components-styles';

import classNames from '@/common/utils/classNames';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useLocalParticipant,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentType, type MouseEvent, type ReactNode } from 'react';
import { Drawer } from 'vaul';
import { AgentAudioVisualizerAura } from '../agents-ui/agent-audio-visualizer-aura';
import { CallAudioFx } from '../audio/callAudioFx';
import { createVoiceSession } from '../api/createVoiceSession';
import { buildUiContext } from '../context/uiContext';
import { formatCallTimer } from '../hooks/useVoiceCall';
import { useVoiceCallUiStore } from '../store/voiceCallUi';
import { UiContextBridge } from './UiContextBridge';
import { AgentUiSurfaceHost } from './AgentUiSurfaceHost';
import { AgentHangupHost } from './AgentHangupHost';
import { useRouter } from 'next/router';

const LKRoom = LiveKitRoom as unknown as ComponentType<{
  serverUrl: string;
  token: string;
  connect?: boolean;
  audio?: boolean;
  video?: boolean;
  onDisconnected?: () => void;
  className?: string;
  children?: ReactNode;
}>;
const LKStartAudio = StartAudio as unknown as ComponentType<{
  label?: string;
  className?: string;
}>;

type Session = { url: string; token: string };

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
    if (!running) return;
    const id = setInterval(() => setElapsedSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return elapsedSec;
}

function CallSheetBody({
  onEnd,
  elapsedSec,
  connected,
}: {
  onEnd: () => void;
  elapsedSec: number;
  connected: boolean;
}) {
  const { state, audioTrack } = useVoiceAssistant();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const room = useRoomContext();

  const toggleMute = () => {
    void localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const endCall = async () => {
    try {
      await room.disconnect();
    } catch {
      // ignore
    }
    onEnd();
  };

  return (
    <div className="flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
      <div className="flex items-center justify-between gap-3">
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
          <p className="tabular-nums text-[15px] font-medium tracking-wide text-slate-500">
            {formatCallTimer(elapsedSec)}
          </p>
        ) : (
          <span className="w-12" aria-hidden />
        )}
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <AgentAudioVisualizerAura
          size="lg"
          color="#60A5FA"
          colorShift={0.12}
          state={state}
          themeMode="light"
          audioTrack={audioTrack}
          className="mx-auto"
        />
      </div>

      <div className="flex items-center justify-center gap-10 pb-1 pt-2">
        <CallControl
          label={isMicrophoneEnabled ? 'بی‌صدا' : 'صدا باز'}
          onClick={toggleMute}
          active={!isMicrophoneEnabled}
        >
          {isMicrophoneEnabled ? (
            <Mic size={22} strokeWidth={1.75} />
          ) : (
            <MicOff size={22} strokeWidth={1.75} />
          )}
        </CallControl>
        <CallControl label="قطع" onClick={endCall} tone="danger">
          <PhoneOff size={22} strokeWidth={1.75} className="translate-y-px" />
        </CallControl>
      </div>
    </div>
  );
}

/** Compact bar while the sheet is dismissed but the call is still live. */
function MinimizedCallPill({
  elapsedSec,
  connected,
  onExpand,
  onEnd,
}: {
  elapsedSec: number;
  connected: boolean;
  onExpand: () => void;
  onEnd: () => void;
}) {
  const room = useRoomContext();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  const hangUp = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await room.disconnect();
    } catch {
      // ignore
    }
    onEnd();
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    void localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  return (
    <div
      className="fixed inset-x-0 z-[101] flex justify-center px-4"
      style={{ bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom) + 4.5rem))' }}
    >
      <button
        type="button"
        onClick={onExpand}
        aria-label="باز کردن تماس با آرش"
        className="flex w-full max-w-sm items-center gap-3 rounded-full bg-white px-3 py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80"
        dir="rtl"
      >
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/voice-agent/arash.png?v=9"
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: '50% 12%' }}
            draggable={false}
          />
        </div>
        <div className="min-w-0 flex-1 text-right">
          <p className="text-[14px] font-semibold text-slate-900">آرش</p>
          {connected && (
            <p className="tabular-nums text-[12px] text-slate-400">{formatCallTimer(elapsedSec)}</p>
          )}
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label={isMicrophoneEnabled ? 'بی‌صدا' : 'صدا باز'}
          onClick={toggleMute}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') toggleMute(e as unknown as MouseEvent);
          }}
          className={classNames(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            isMicrophoneEnabled ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-white',
          )}
        >
          {isMicrophoneEnabled ? <Mic size={16} strokeWidth={1.75} /> : <MicOff size={16} strokeWidth={1.75} />}
        </span>
        <span
          role="button"
          tabIndex={0}
          aria-label="قطع"
          onClick={hangUp}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') hangUp(e as unknown as MouseEvent);
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-white"
        >
          <PhoneOff size={16} strokeWidth={1.75} />
        </span>
      </button>
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

function CallRoomChrome({
  fx,
  expanded,
  onMinimize,
  onExpand,
  onEnd,
}: {
  fx: CallAudioFx | null;
  expanded: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onEnd: () => void;
}) {
  const { state } = useVoiceAssistant();
  const ending = useVoiceCallUiStore(s => s.ending);
  const connected = state !== 'connecting' && state !== 'disconnected' && state !== 'initializing';
  const elapsedSec = useCallTimer(connected && !ending);

  useEffect(() => {
    if (connected && !ending) fx?.playConnected();
  }, [connected, ending, fx]);

  useEffect(() => {
    if (ending) fx?.playDisconnectedIfConnected();
  }, [ending, fx]);

  const sheetOpen = expanded || ending;

  return (
    <>
      <UiContextBridge />
      <AgentUiSurfaceHost />
      <AgentHangupHost />
      <RoomAudioRenderer />
      {sheetOpen ? (
        <Drawer.Root
          open
          onOpenChange={next => {
            if (!next && !ending) onMinimize();
          }}
          modal
          dismissible={!ending}
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
              <Drawer.Description className="sr-only">دستیار صوتی پذیرش۲۴</Drawer.Description>
              {ending ? (
                <CallEndedBody />
              ) : (
                <>
                  <CallSheetBody onEnd={onEnd} elapsedSec={elapsedSec} connected={connected} />
                  <LKStartAudio
                    label="برای شنیدن صدا ضربه بزنید"
                    className="absolute inset-x-0 bottom-24 mx-auto w-max rounded-full bg-white px-4 py-2 text-[13px] text-slate-700 ring-1 ring-slate-200"
                  />
                </>
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      ) : (
        <MinimizedCallPill
          elapsedSec={elapsedSec}
          connected={connected}
          onExpand={onExpand}
          onEnd={onEnd}
        />
      )}
    </>
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
        {error ? <p className="mt-1 text-[14px] text-red-500">تماس برقرار نشد</p> : null}
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
 * Call UI: half-sheet while expanded, floating pill while minimized.
 * Dismissing the sheet minimizes; only hang-up ends the LiveKit session.
 */
export function CallOverlay() {
  const router = useRouter();
  const active = useVoiceCallUiStore(s => s.active);
  const expanded = useVoiceCallUiStore(s => s.expanded);
  const expandCall = useVoiceCallUiStore(s => s.expandCall);
  const minimizeCall = useVoiceCallUiStore(s => s.minimizeCall);
  const endCall = useVoiceCallUiStore(s => s.endCall);

  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const fxRef = useRef<CallAudioFx | null>(null);

  useEffect(() => {
    if (!active) return;
    const fx = new CallAudioFx();
    fxRef.current = fx;
    return () => {
      if (fxRef.current !== fx) return;
      fxRef.current = null;
      // Soft hang-up chime only if the agent had actually joined.
      fx.playDisconnectedIfConnected();
      window.setTimeout(() => fx.dispose(), 800);
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      setSession(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setSession(null);
    // Snapshot at call start only — live updates go over the data channel.
    const uiContext = buildUiContext({
      asPath: router.asPath,
      pathname: router.pathname,
      query: router.query as Record<string, string | string[] | undefined>,
    });
    (async () => {
      try {
        const data = await createVoiceSession(uiContext);
        if (!cancelled) setSession({ url: data.url, token: data.token });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'call_failed');
      }
    })();
    return () => {
      cancelled = true;
    };
    // intentionally omit router.* — must not reconnect on navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, attempt]);

  if (!active) return null;

  // Connecting / error: only as an expanded sheet (nothing to minimize yet).
  if (!session) {
    return (
      <Drawer.Root
        open={expanded}
        onOpenChange={next => {
          if (!next) endCall();
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
              onClose={endCall}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <LKRoom
      serverUrl={session.url}
      token={session.token}
      connect
      audio
      video={false}
      onDisconnected={endCall}
      className="contents"
    >
      <CallRoomChrome
        fx={fxRef.current}
        expanded={expanded}
        onMinimize={minimizeCall}
        onExpand={expandCall}
        onEnd={endCall}
      />
    </LKRoom>
  );
}

/** DR-08 §۱۲ — default export تا `next/dynamic` بتواند این کامپوننت را lazy کند (VoiceCallHost). */
export default CallOverlay;
