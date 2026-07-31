import { create } from 'zustand';
import { useAgentUiSurfaceStore } from './agentUiSurface';
import type { WsVoiceStatus } from '../transport/wsVoiceSession';

type VoiceCallUiState = {
  /** Call session is in progress (sheet may be open or closed). */
  active: boolean;
  /**
   * Call sheet expanded. When false while `active`, the floating Aura FAB
   * is the minimized affordance (no bottom pill).
   */
  expanded: boolean;
  /** Graceful hangup: show «تماس پایان یافت» before tearing down. */
  ending: boolean;
  /** Live WS session status for FAB Aura (updated by CallOverlay). */
  sessionStatus: WsVoiceStatus;
  /** Agent TTS level 0..1 for FAB Aura while speaking. */
  agentVolume: number;
  openCall: () => void;
  expandCall: () => void;
  minimizeCall: () => void;
  beginEnding: () => void;
  endCall: () => void;
  setSessionStatus: (status: WsVoiceStatus) => void;
  setAgentVolume: (volume: number) => void;
};

export const useVoiceCallUiStore = create<VoiceCallUiState>(set => ({
  active: false,
  expanded: false,
  ending: false,
  sessionStatus: 'idle',
  agentVolume: 0,
  openCall: () =>
    set(s =>
      s.active
        ? { expanded: true, ending: false }
        : {
            active: true,
            expanded: true,
            ending: false,
            sessionStatus: 'connecting',
            agentVolume: 0,
          },
    ),
  expandCall: () => set({ expanded: true }),
  minimizeCall: () => set(s => (s.ending ? s : { expanded: false })),
  beginEnding: () => {
    useAgentUiSurfaceStore.getState().clearPrompt();
    set({ ending: true, expanded: true, active: true });
  },
  endCall: () => {
    useAgentUiSurfaceStore.getState().clearPrompt();
    set({
      active: false,
      expanded: false,
      ending: false,
      sessionStatus: 'idle',
      agentVolume: 0,
    });
  },
  setSessionStatus: status => set({ sessionStatus: status }),
  setAgentVolume: volume => set({ agentVolume: volume }),
}));
