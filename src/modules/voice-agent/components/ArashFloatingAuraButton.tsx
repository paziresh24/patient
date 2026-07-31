import GripIcon from '@/common/components/icons/grip';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { AgentAudioVisualizerAura } from '../agents-ui/agent-audio-visualizer-aura';
import { ARASH_VOICE_AGENT_FEATURE } from '../constants';
import { useVoiceCallUiStore } from '../store/voiceCallUi';
import type { WsVoiceStatus } from '../transport/wsVoiceSession';
import { isArashEligibleDoctor } from '../utils/isArashEligibleDoctor';

const BRAND_AURA = '#3861fb';
const FAB_SIZE = 56;
const MOVE_THRESHOLD_PX = 10;
const EDGE_PAD = 16;
const BOTTOM_NAV_H = 64;
const STORAGE_KEY = 'arash.fab.position';
const HINT_STORAGE_KEY = 'arash.fab.dragHintSeen';
const HINT_DELAY_MS = 600;
const HINT_AUTO_HIDE_MS = 4500;

type FabPos = { right: number; bottom: number };

function statusToAura(status: WsVoiceStatus): 'connecting' | 'listening' | 'speaking' | 'thinking' | 'disconnected' {
  if (status === 'speaking') return 'speaking';
  if (status === 'listening') return 'listening';
  if (status === 'thinking') return 'thinking';
  if (status === 'connecting') return 'connecting';
  return 'disconnected';
}

function safeInsets() {
  // env(safe-area-inset-*) is not reliably readable via getComputedStyle; clamp
  // uses bottom-nav height + edge pad which covers typical phone chrome.
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function defaultPos(): FabPos {
  const inset = safeInsets();
  return {
    right: EDGE_PAD + inset.right,
    bottom: EDGE_PAD + inset.bottom + BOTTOM_NAV_H + 8,
  };
}

function clampPos(pos: FabPos): FabPos {
  if (typeof window === 'undefined') return pos;
  const inset = safeInsets();
  const minRight = EDGE_PAD + inset.right;
  const minBottom = EDGE_PAD + inset.bottom + BOTTOM_NAV_H + 8;
  const maxRight = Math.max(minRight, window.innerWidth - FAB_SIZE - EDGE_PAD - inset.left);
  const maxBottom = Math.max(minBottom, window.innerHeight - FAB_SIZE - EDGE_PAD - inset.top);
  return {
    right: Math.min(maxRight, Math.max(minRight, pos.right)),
    bottom: Math.min(maxBottom, Math.max(minBottom, pos.bottom)),
  };
}

function loadPos(): FabPos {
  if (typeof window === 'undefined') return defaultPos();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clampPos(defaultPos());
    const parsed = JSON.parse(raw) as Partial<FabPos>;
    if (typeof parsed.right !== 'number' || typeof parsed.bottom !== 'number') {
      return clampPos(defaultPos());
    }
    return clampPos({ right: parsed.right, bottom: parsed.bottom });
  } catch {
    return clampPos(defaultPos());
  }
}

function savePos(pos: FabPos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch {
    /* ignore quota */
  }
}

function isDragHintSeen(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(HINT_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

function markDragHintSeen() {
  try {
    localStorage.setItem(HINT_STORAGE_KEY, '1');
  } catch {
    /* ignore quota */
  }
}

/**
 * Global draggable Aura FAB — primary Arash entry and minimized call chrome.
 */
export function ArashFloatingAuraButton() {
  const isFeatureEnabled = useFeatureIsOn(ARASH_VOICE_AGENT_FEATURE);
  const user = useUserInfoStore(s => s.info);
  const pending = useUserInfoStore(s => s.pending);
  const isLogin = useUserInfoStore(s => s.isLogin);

  const active = useVoiceCallUiStore(s => s.active);
  const expanded = useVoiceCallUiStore(s => s.expanded);
  const ending = useVoiceCallUiStore(s => s.ending);
  const sessionStatus = useVoiceCallUiStore(s => s.sessionStatus);
  const agentVolume = useVoiceCallUiStore(s => s.agentVolume);
  const openCall = useVoiceCallUiStore(s => s.openCall);
  const expandCall = useVoiceCallUiStore(s => s.expandCall);

  const [pos, setPos] = useState<FabPos>(() => defaultPos());
  const [positioned, setPositioned] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originRight: number;
    originBottom: number;
    dragging: boolean;
  } | null>(null);

  const dismissHint = useCallback(() => {
    markDragHintSeen();
    setShowHint(false);
  }, []);

  // Resolve storage before paint so CDN/SSR never flashes default → saved.
  useLayoutEffect(() => {
    setPos(clampPos(loadPos()));
    setPositioned(true);
  }, []);

  useEffect(() => {
    const onResize = () => setPos(p => clampPos(p));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const gateOk =
    isFeatureEnabled && !pending && isLogin && Boolean(user?.id) && isArashEligibleDoctor(user);
  const hidden = !gateOk || expanded || ending;

  // One-time tooltip; do not mark seen if sheet hides before it appears.
  useEffect(() => {
    if (!positioned || hidden || isDragHintSeen()) return;

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    const showTimer = setTimeout(() => {
      if (isDragHintSeen()) return;
      setShowHint(true);
      markDragHintSeen();
      hideTimer = setTimeout(() => {
        setShowHint(false);
      }, HINT_AUTO_HIDE_MS);
    }, HINT_DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
      setShowHint(false);
    };
  }, [positioned, hidden]);

  const auraState = active ? statusToAura(sessionStatus) : 'listening';
  const volume = active && auraState === 'speaking' ? agentVolume : 0;

  const endPointer = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      const state = dragRef.current;
      if (!state || state.pointerId !== e.pointerId) return;

      const wasDragging = state.dragging;
      dragRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      if (wasDragging) {
        dismissHint();
        const next = clampPos(posRef.current);
        setPos(next);
        savePos(next);
        return;
      }

      dismissHint();
      if (active) expandCall();
      else openCall();
    },
    [active, dismissHint, expandCall, openCall],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const origin = posRef.current;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originRight: origin.right,
      originBottom: origin.bottom,
      dragging: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const state = dragRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const dist = Math.hypot(dx, dy);
    if (!state.dragging && dist >= MOVE_THRESHOLD_PX) {
      state.dragging = true;
    }
    if (!state.dragging) return;

    // right/bottom: moving pointer left increases right; moving up increases bottom.
    const next = clampPos({
      right: state.originRight - dx,
      bottom: state.originBottom - dy,
    });
    setPos(next);
  };

  if (!positioned || hidden) return null;

  return (
    <div
      className="fixed z-[95]"
      style={{
        width: FAB_SIZE,
        height: FAB_SIZE,
        right: pos.right,
        bottom: pos.bottom,
      }}
    >
      {showHint && (
        <div
          role="status"
          className={classNames(
            'absolute bottom-1/2 right-[calc(100%+10px)] z-[1] flex translate-y-1/2 items-center gap-1.5',
            'whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg',
          )}
        >
          <GripIcon className="shrink-0 text-white/90" width={12} height={12} />
          <span>قابل جابه‌جایی</span>
          <span
            aria-hidden
            className="absolute left-full top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-slate-900"
          />
        </div>
      )}
      <button
        type="button"
        aria-label={active ? 'باز کردن تماس آرش' : 'تماس با آرش'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        className={classNames(
          'flex h-full w-full touch-none items-center justify-center rounded-full',
          'bg-white/90 shadow-[0_8px_28px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80',
          'active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        )}
      >
        <span className="pointer-events-none flex h-12 w-12 items-center justify-center">
          <AgentAudioVisualizerAura
            size="sm"
            state={auraState === 'disconnected' ? 'listening' : auraState}
            color={BRAND_AURA}
            colorShift={0}
            themeMode="light"
            volume={volume}
            className="!h-12 !w-12"
          />
        </span>
      </button>
    </div>
  );
}
