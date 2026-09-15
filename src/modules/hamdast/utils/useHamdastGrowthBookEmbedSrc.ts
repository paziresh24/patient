import { useFeatureValue } from '@growthbook/growthbook-react';
import { useMemo } from 'react';

export const appendUserIdToEmbedSrc = (
  base: string,
  userId: string | number,
  locationSearch = typeof window !== 'undefined' ? window.location.search : '',
) => {
  if (locationSearch) {
    return `${base}${locationSearch}&user_id=${userId}`;
  }

  return `${base}?user_id=${userId}`;
};

export const useHamdastGrowthBookEmbedSrc = (
  featureKey: string,
  fallbackEmbedSrc: string | undefined,
  userId: string | number | undefined,
) => {
  const growthBookConfig = useFeatureValue<{ embed_src?: string }>(featureKey, {
    embed_src: fallbackEmbedSrc ?? '',
  });

  return useMemo((): string | undefined => {
    if (!userId) return undefined;

    const base = growthBookConfig?.embed_src || fallbackEmbedSrc;
    if (!base) return undefined;

    return appendUserIdToEmbedSrc(base, userId);
  }, [growthBookConfig?.embed_src, fallbackEmbedSrc, userId]);
};
