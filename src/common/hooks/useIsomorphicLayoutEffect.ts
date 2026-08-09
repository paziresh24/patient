import { useEffect, useLayoutEffect } from 'react';

/** useLayoutEffect on client; useEffect on server to avoid SSR warnings. */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
