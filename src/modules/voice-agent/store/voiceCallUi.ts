import { create } from 'zustand';
import { useAgentUiSurfaceStore } from './agentUiSurface';

type VoiceCallUiState = {
  /** LiveKit call is in progress (sheet may be open or minimized). */
  active: boolean;
  /** Half-sheet is expanded; false = minimized pill while call continues. */
  expanded: boolean;
  /** Graceful hangup: show «تماس پایان یافت» before tearing down. */
  ending: boolean;
  openCall: () => void;
  expandCall: () => void;
  minimizeCall: () => void;
  /** Enter ending UI (keep active until finishHangup). */
  beginEnding: () => void;
  /** Tear down call UI completely. */
  endCall: () => void;
};

export const useVoiceCallUiStore = create<VoiceCallUiState>(set => ({
  active: false,
  expanded: false,
  ending: false,
  openCall: () =>
    set(s =>
      s.active
        ? { expanded: true, ending: false }
        : { active: true, expanded: true, ending: false },
    ),
  expandCall: () => set({ expanded: true }),
  minimizeCall: () => set(s => (s.ending ? s : { expanded: false })),
  beginEnding: () => {
    useAgentUiSurfaceStore.getState().clearPrompt();
    set({ ending: true, expanded: true, active: true });
  },
  endCall: () => {
    useAgentUiSurfaceStore.getState().clearPrompt();
    set({ active: false, expanded: false, ending: false });
  },
}));
