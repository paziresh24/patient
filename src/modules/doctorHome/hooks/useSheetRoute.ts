import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const STACK_KEY = 'sheets';

function parseStack(query: Record<string, string | string[] | undefined>): string[] {
  const val = query[STACK_KEY];
  const str = Array.isArray(val) ? val[0] : (val ?? '');
  return str ? str.split(',').filter(Boolean) : [];
}

/**
 * open state از useState هست → باز/بسته شدن فوری، بدون async delay.
 * URL فقط برای sync با back/forward button و deep link استفاده میشه.
 *
 * باز کردن  → setOpen(true) + router.push  (entry به history اضافه میشه)
 * بستن      → setOpen(false) + router.replace (بدون scroll jump)
 * back button → URL تغییر میکنه → useEffect تشخیص میده → setOpen(false)
 */
export function useSheetRoute(key: string) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // جلوگیری از scroll jump هنگام navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // sync از URL → open state (back button، forward button، deep link)
  useEffect(() => {
    if (!router.isReady) return;
    setOpen(parseStack(router.query).includes(key));
  }, [router.query, router.isReady, key]);

  const openSheet = useCallback(
    (extraParams?: Record<string, string>) => {
      setOpen(true); // فوری — بدون منتظر ماندن برای router
      const currentStack = parseStack(router.query);
      const newStack = [...currentStack.filter(k => k !== key), key];
      router.push(
        { query: { ...router.query, [STACK_KEY]: newStack.join(','), ...extraParams } },
        undefined,
        { shallow: true, scroll: false },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.query, key],
  );

  const closeSheet = useCallback(() => {
    setOpen(false); // فوری
    const currentStack = parseStack(router.query);
    const newStack = currentStack.filter(k => k !== key);
    const newQuery: Record<string, string | string[] | undefined> = {
      ...router.query,
      [STACK_KEY]: newStack.join(','),
    };
    if (newStack.length === 0) delete newQuery[STACK_KEY];
    router.replace({ query: newQuery }, undefined, { shallow: true, scroll: false });
  }, [router, key]); // eslint-disable-line react-hooks/exhaustive-deps

  return { open, openSheet, closeSheet };
}
