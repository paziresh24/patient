import { create } from 'zustand';
import type { AgentUiPrompt } from '../ui-surface/types';

type AgentUiSurfaceState = {
  prompt: AgentUiPrompt | null;
  setPrompt: (prompt: AgentUiPrompt | null) => void;
  clearPrompt: () => void;
};

export const useAgentUiSurfaceStore = create<AgentUiSurfaceState>(set => ({
  prompt: null,
  setPrompt: prompt => set({ prompt }),
  clearPrompt: () => set({ prompt: null }),
}));
