import React, { useEffect, useMemo, useState } from 'react';
import { DataProvider, GlobalActionsProvider, GlobalContextMeta } from '@plasmicapp/host';
import useApplication from '../hooks/useApplication';

interface FragmentPWAProps {}

export const PWA = ({ children }: React.PropsWithChildren<FragmentPWAProps>) => {
  const isApplication = useApplication();
  return (
    <GlobalActionsProvider contextName="FragmentPWAActions" actions={{}}>
      <DataProvider
        name="Fragment/PWA"
        data={{
          isPWAUser: isApplication,
        }}
      >
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};

export const fragmentPWAMeta: GlobalContextMeta<FragmentPWAProps> = {
  name: 'PWA',
  displayName: 'Fragment/PWA',
  importPath: '@/common/fragment/pwa',
  props: {},
  providesData: true,
  globalActions: {},
};
