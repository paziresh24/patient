import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useCallback, useState } from 'react';

const SLUG_WAIT_TIMEOUT_MS = 12_000;

export const getDoctorPublicProfileUrl = (slug: string) =>
  `/dr/${slug}?@timestamp=${new Date().getTime()}`;

/** Resolve slug from store, waiting while doctorSlugPending if needed. */
export const waitForDoctorSlug = (timeoutMs = SLUG_WAIT_TIMEOUT_MS): Promise<string | undefined> => {
  const initial = useUserInfoStore.getState();
  if (initial.info.provider?.slug) return Promise.resolve(initial.info.provider.slug);
  if (!initial.doctorSlugPending) return Promise.resolve(initial.info.provider?.slug);

  return new Promise(resolve => {
    let settled = false;
    const finish = (slug?: string) => {
      if (settled) return;
      settled = true;
      unsubscribe();
      clearTimeout(timer);
      resolve(slug);
    };

    const unsubscribe = useUserInfoStore.subscribe(state => {
      if (state.info.provider?.slug) {
        finish(state.info.provider.slug);
        return;
      }
      if (!state.doctorSlugPending) {
        finish(state.info.provider?.slug);
      }
    });

    const timer = setTimeout(() => {
      finish(useUserInfoStore.getState().info.provider?.slug);
    }, timeoutMs);
  });
};

export const useOpenDoctorPublicProfile = () => {
  const slug = useUserInfoStore(state => state.info.provider?.slug);
  const doctorSlugPending = useUserInfoStore(state => state.doctorSlugPending);
  const [isOpening, setIsOpening] = useState(false);

  const isSlugLoading = Boolean(doctorSlugPending && !slug);

  const openPublicProfile = useCallback(async () => {
    if (slug) {
      window.open(getDoctorPublicProfileUrl(slug));
      return true;
    }

    setIsOpening(true);
    try {
      const resolved = await waitForDoctorSlug();
      if (!resolved) return false;
      window.open(getDoctorPublicProfileUrl(resolved));
      return true;
    } finally {
      setIsOpening(false);
    }
  }, [slug]);

  return {
    slug,
    isSlugLoading,
    isOpening,
    openPublicProfile,
  };
};
