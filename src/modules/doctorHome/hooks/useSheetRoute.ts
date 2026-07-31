import { isMobileViewport } from '@/common/hooks/useResponsive';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { captureDoctorHomeScroll, restoreDoctorHomeScroll } from '../utils/doctorHomeScroll';
import { useDoctorViewSwapActive } from './useDoctorViewSwapActive';

const STACK_KEY = 'sheets';
/** جلوگیری از باز شدن مجدد بعد از ghost-click یا URL قدیمی */
const OPEN_SUPPRESS_AFTER_CLOSE_MS = 600;

const normalizePath = (pathname: string) => (pathname === '/_' ? '/_/' : pathname);

type SheetEntry = {
  open: boolean;
  lastClosedAt: number;
  lastExtraParams: Record<string, string>;
};

const sheetStore = new Map<string, SheetEntry>();
const sheetListeners = new Map<string, Set<() => void>>();

function getEntry(key: string): SheetEntry {
  if (!sheetStore.has(key)) {
    sheetStore.set(key, {
      open: false,
      lastClosedAt: 0,
      lastExtraParams: {},
    });
  }
  return sheetStore.get(key)!;
}

function subscribeSheet(key: string, listener: () => void) {
  if (!sheetListeners.has(key)) sheetListeners.set(key, new Set());
  sheetListeners.get(key)!.add(listener);
  return () => sheetListeners.get(key)?.delete(listener);
}

function emitSheet(key: string) {
  sheetListeners.get(key)?.forEach(listener => listener());
}

function patchSheet(key: string, patch: Partial<SheetEntry>) {
  const entry = getEntry(key);
  Object.assign(entry, patch);
  emitSheet(key);
}

function parseStackFromLocation(): string[] {
  if (typeof window === 'undefined') return [];
  const val = new URLSearchParams(window.location.search).get(STACK_KEY) ?? '';
  return val ? val.split(',').filter(Boolean) : [];
}

function buildLocationQuery(
  base: Record<string, string | string[] | undefined>,
  stack: string[],
  extraParams: Record<string, string>,
): Record<string, string | string[] | undefined> {
  const next: Record<string, string | string[] | undefined> = { ...base };

  if (stack.length === 0) delete next[STACK_KEY];
  else next[STACK_KEY] = stack.join(',');

  Object.entries(extraParams).forEach(([param, value]) => {
    next[param] = value;
  });

  return next;
}

function toSearchParams(query: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) value.forEach(item => params.append(key, item));
    else params.set(key, value);
  });
  return params;
}

function queryFromLocation(): Record<string, string | string[] | undefined> {
  if (typeof window === 'undefined') return {};
  const next: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    next[key] = value;
  });
  return next;
}

function readStack(): string[] {
  return parseStackFromLocation();
}

function buildBrowserUrl(query: Record<string, string | string[] | undefined>) {
  const pathname = normalizePath(window.location.pathname);
  const params = toSearchParams(query);
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

function writeBrowserHistory(
  query: Record<string, string | string[] | undefined>,
  method: 'push' | 'replace',
) {
  const url = buildBrowserUrl(query);
  const state = window.history.state;
  if (method === 'push') window.history.pushState(state, '', url);
  else window.history.replaceState(state, '', url);
}

/** روی موبایل فقط History API — router.push/replace با Vaul تداخل داشت */
function usesBrowserHistoryOnly() {
  return typeof window !== 'undefined' && isMobileViewport();
}

type RouterLike = {
  pathname: string;
  query: Record<string, string | string[] | undefined>;
  isReady: boolean;
  replace: (
    url: { pathname: string; query: Record<string, string | string[] | undefined> },
    as?: string,
    options?: { shallow?: boolean; scroll?: boolean },
  ) => void;
  push: (
    url: { pathname: string; query: Record<string, string | string[] | undefined> },
    as?: string,
    options?: { shallow?: boolean; scroll?: boolean },
  ) => void;
};

function commitStackToUrl(
  router: RouterLike,
  useHistoryUrl: boolean,
  stack: string[],
  extraParams: Record<string, string>,
  method: 'push' | 'replace',
) {
  const baseQuery = typeof window !== 'undefined' ? queryFromLocation() : router.query;
  const newQuery = buildLocationQuery(baseQuery, stack, extraParams);

  if (typeof window !== 'undefined') {
    writeBrowserHistory(newQuery, method);
  }

  if (usesBrowserHistoryOnly() || useHistoryUrl) return;

  const routeFn = method === 'push' ? router.push : router.replace;
  routeFn({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true, scroll: false });
}

function isOpenSuppressed(key: string) {
  return Date.now() - getEntry(key).lastClosedAt < OPEN_SUPPRESS_AFTER_CLOSE_MS;
}

/** فقط mount اولیه و دکمه back — state منبع حقیقت UI است */
function syncSheetFromBrowserNavigation(key: string) {
  const isOpenInUrl = readStack().includes(key);
  const entry = getEntry(key);

  if (isOpenInUrl && !entry.open && isOpenSuppressed(key)) return;

  if (entry.open !== isOpenInUrl) {
    patchSheet(key, { open: isOpenInUrl });
  }
}

export type CloseSheetHistory = 'auto' | 'back' | 'replace';

/**
 * UI state (store) و URL مستقل ولی هماهنگ:
 * - باز/بسته شدن UI از store
 * - URL با History API (موبایل) یا shallow router (دسکتاپ)
 * - sync از URL فقط در mount و popstate
 * - بستن شیت بالای استک با history.back تا بک منوی زیرین را برگرداند
 */
export function useSheetRoute(key: string) {
  const router = useRouter();
  const swapActive = useDoctorViewSwapActive();
  const useHistoryUrl = swapActive && router.pathname === '/';

  const open = useSyncExternalStore(
    useCallback(onStoreChange => subscribeSheet(key, onStoreChange), [key]),
    () => getEntry(key).open,
    () => false,
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    syncSheetFromBrowserNavigation(key);
  }, [router.isReady, key]);

  useEffect(() => {
    if (!router.isReady) return;

    const onPopState = () => {
      // history.back() from sheet close — keep page where the user was.
      restoreDoctorHomeScroll();
      syncSheetFromBrowserNavigation(key);
      // Next.js may scroll-to-top on popstate after our sync; re-apply.
      restoreDoctorHomeScroll();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [router.isReady, key]);

  const openSheet = useCallback(
    (extraParams?: Record<string, string>) => {
      if (isOpenSuppressed(key)) return;

      captureDoctorHomeScroll();
      patchSheet(key, {
        lastExtraParams: extraParams ?? {},
        open: true,
      });

      const currentStack = readStack();
      const newStack = [...currentStack.filter(sheetKey => sheetKey !== key), key];
      commitStackToUrl(router, useHistoryUrl, newStack, extraParams ?? {}, 'push');
    },
    [router, key, useHistoryUrl],
  );

  /**
   * شیت‌های هم‌سطح را از استک برمی‌دارد و این شیت را روی والدین باز می‌کند.
   * - اگر بالای استک یک شیت هم‌سطح بود → replace (تعویض، بدون ورود تاریخچه اضافه)
   * - اگر بالای استک منوی والد بود → push (بک برمی‌گردد به منو)
   */
  const openSheetOver = useCallback(
    (keysToClose: string[], extraParams?: Record<string, string>) => {
      if (isOpenSuppressed(key)) return;

      captureDoctorHomeScroll();
      const closeSet = new Set(keysToClose.filter(sheetKey => sheetKey !== key));
      const currentStack = readStack();
      const previousTop = currentStack[currentStack.length - 1];

      closeSet.forEach(sheetKey => {
        const entry = getEntry(sheetKey);
        if (!entry.open) return;
        patchSheet(sheetKey, {
          lastClosedAt: Date.now(),
          open: false,
          lastExtraParams: {},
        });
      });

      patchSheet(key, {
        lastExtraParams: extraParams ?? {},
        open: true,
      });

      const newStack = [...currentStack.filter(sheetKey => sheetKey !== key && !closeSet.has(sheetKey)), key];
      const swappingSibling = !!previousTop && (previousTop === key || closeSet.has(previousTop));
      commitStackToUrl(
        router,
        useHistoryUrl,
        newStack,
        extraParams ?? {},
        swappingSibling ? 'replace' : 'push',
      );
    },
    [router, key, useHistoryUrl],
  );

  const closeSheet = useCallback(
    (historyMode: CloseSheetHistory = 'auto') => {
      const entry = getEntry(key);
      if (!entry.open) return;

      const extraParamsToRemove = { ...entry.lastExtraParams };

      patchSheet(key, {
        lastClosedAt: Date.now(),
        open: false,
        lastExtraParams: {},
      });

      const currentStack = readStack();
      if (!currentStack.includes(key)) {
        restoreDoctorHomeScroll();
        return;
      }

      const isTop = currentStack[currentStack.length - 1] === key;
      const useBack =
        historyMode === 'back' || (historyMode === 'auto' && isTop && typeof window !== 'undefined');

      if (useBack) {
        // ورود قبلی استک بدون این شیت را دارد (open با push آمده) — بک منوی زیرین را نشان می‌دهد
        window.history.back();
        restoreDoctorHomeScroll();
        return;
      }

      const newStack = currentStack.filter(sheetKey => sheetKey !== key);
      const baseQuery = queryFromLocation();
      Object.keys(extraParamsToRemove).forEach(param => {
        delete baseQuery[param];
      });

      commitStackToUrl(router, useHistoryUrl, newStack, {}, 'replace');
      restoreDoctorHomeScroll();
    },
    [router, key, useHistoryUrl],
  );

  return { open, openSheet, openSheetOver, closeSheet };
}

/** @deprecated از `useSheetDrawerProps` استفاده کنید */
export const sheetDrawerProps = (sheet: { open: boolean; closeSheet: () => void }) => ({
  open: sheet.open,
  onOpenChange: (nextOpen: boolean) => {
    if (!nextOpen) sheet.closeSheet();
  },
});

export { useDoctorHomeSheetHost, useSheetDrawerProps, DoctorHomeSheetLayoutProvider } from './doctorHomeSheetLayout';
export type { DoctorHomeSheetLayout } from './doctorHomeSheetLayout';
