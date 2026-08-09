'use client';

import { AppFrame } from '@/modules/hamdast/appFrame';
import { prefetchOneApp } from '@/modules/hamdast/utils/prefetchOneApp';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { DsDrawer } from '../components/DsDrawer';
import { sheetDrawerProps, useSheetRoute } from './useSheetRoute';

const APP_SHEET_KEY = 'hamdast-app';
const APP_KEY_PARAM = 'app_key';
const TOOLBOX_SHEET_KEY = 'toolbox';

function readSheetStackFromLocation(): string[] {
  if (typeof window === 'undefined') return [];
  const val = new URLSearchParams(window.location.search).get('sheets') ?? '';
  return val ? val.split(',').filter(Boolean) : [];
}

type OpenDoctorHomeApp = (appKey: string) => void;

const DoctorHomeAppModalContext = createContext<OpenDoctorHomeApp | null>(null);

export const useDoctorHomeAppModal = () => {
  const openApp = useContext(DoctorHomeAppModalContext);
  if (!openApp) {
    throw new Error('useDoctorHomeAppModal must be used within DoctorHomeAppModalProvider');
  }
  return openApp;
};

export const DoctorHomeAppModalProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const appSheet = useSheetRoute(APP_SHEET_KEY);
  const [appKey, setAppKey] = useState('');
  const [runFullscreen, setRunFullscreen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!appSheet.open) {
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => {
        setAppKey('');
        setRunFullscreen(false);
      }, 350);
      return () => clearTimeout(closeTimer.current);
    }

    // Cancel a pending clear from a recent close (quick reopen).
    clearTimeout(closeTimer.current);

    // On mobile / doctor-home swap, sheets update the URL via History API only —
    // Next's router.query can stay on a previous app_key and overwrite the one
    // just set in openApp. Prefer the live location search.
    const fromLocation =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get(APP_KEY_PARAM)
        : null;
    const fromQuery = router.query[APP_KEY_PARAM];
    const key =
      fromLocation ||
      (typeof fromQuery === 'string' && fromQuery ? fromQuery : '');
    if (key) setAppKey(key);
  }, [appSheet.open, router.query]);

  const openApp = useCallback(
    (key: string) => {
      void prefetchOneApp(queryClient, { appKey: key, pageKey: 'launcher' }, []);
      setAppKey(key);
      const extra = { [APP_KEY_PARAM]: key };
      // بستن toolbox با history.back() قبل از push باعث race و باز نشدن اپ می‌شد
      if (readSheetStackFromLocation().includes(TOOLBOX_SHEET_KEY)) {
        appSheet.openSheetOver([TOOLBOX_SHEET_KEY], extra);
        return;
      }
      appSheet.openSheet(extra);
    },
    [queryClient, appSheet],
  );

  const closeApp = useCallback(() => {
    appSheet.closeSheet();
  }, [appSheet]);

  return (
    <DoctorHomeAppModalContext.Provider value={openApp}>
      {children}
      <DsDrawer
        {...sheetDrawerProps(appSheet)}
        description="اپلیکیشن"
        fullHeight
        expanded={runFullscreen}
        className="!p-0"
      >
        {appSheet.open && appKey ? (
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <AppFrame
              key={appKey}
              appKey={appKey}
              params={['launcher']}
              dontShowAppBar
              dontShowNotification
              onHamdastClose={closeApp}
              closeVardastOnHamdastClose
              onRunFullscreenChange={setRunFullscreen}
            />
          </div>
        ) : null}
      </DsDrawer>
    </DoctorHomeAppModalContext.Provider>
  );
};
