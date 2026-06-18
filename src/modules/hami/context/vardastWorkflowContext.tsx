import { useHamiVardastWorkflow } from '@/modules/hami/hooks/useHamiVardastWorkflow';
import { createContext, ReactNode, useContext } from 'react';

type VardastWorkflowContextValue = ReturnType<typeof useHamiVardastWorkflow>;

const VardastWorkflowContext = createContext<VardastWorkflowContextValue | null>(null);

interface VardastWorkflowProviderProps {
  chatId: string | null;
  isOpen: boolean;
  enabled?: boolean;
  children: ReactNode;
}

export const VardastWorkflowProvider = ({ chatId, isOpen, enabled = true, children }: VardastWorkflowProviderProps) => {
  const value = useHamiVardastWorkflow(chatId, isOpen, enabled);

  return <VardastWorkflowContext.Provider value={value}>{children}</VardastWorkflowContext.Provider>;
};

export const useVardastWorkflow = () => {
  const context = useContext(VardastWorkflowContext);
  if (!context) {
    throw new Error('useVardastWorkflow must be used within VardastWorkflowProvider');
  }
  return context;
};
