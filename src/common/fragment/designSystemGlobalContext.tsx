import React, { useMemo } from 'react';
import { GlobalActionsProvider } from '@plasmicapp/host';
import toast, { ToastPosition } from 'react-hot-toast';

interface DesignSystemGlobalContextProps {}

export const DesignSystemGlobalContext = ({ children }: React.PropsWithChildren<DesignSystemGlobalContextProps>) => {
  const actions = useMemo(
    () => ({
      showToast: (type: 'success' | 'error', message: string, placement: ToastPosition = 'top-right', duration?: number) => {
        toast[type ?? 'success'](message, {
          duration: duration,
          position: (placement.includes('left')
            ? placement.replace('left', 'right')
            : placement.includes('right')
            ? placement.replace('right', 'left')
            : placement) as ToastPosition,
        });
      },
    }),
    [],
  );

  return (
    <GlobalActionsProvider contextName="Fragment" actions={actions}>
      {children}
    </GlobalActionsProvider>
  );
};
