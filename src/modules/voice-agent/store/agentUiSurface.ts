import { create } from 'zustand';
import type { AgentUiPrompt } from '../ui-surface/types';

type AgentUiSurfaceState = {
  prompt: AgentUiPrompt | null;
  setPrompt: (prompt: AgentUiPrompt | null) => void;
  clearPrompt: () => void;
};

export const useAgentUiSurfaceStore = create<AgentUiSurfaceState>((set, get) => ({
  prompt: null,
  setPrompt: prompt => {
    const prev = get().prompt;
    // Ignore no-op replaces (same id) to avoid remount flicker.
    if (prev?.id && prompt?.id && prev.id === prompt.id) return;
    set({ prompt });
  },
  clearPrompt: () => set({ prompt: null }),
}));
