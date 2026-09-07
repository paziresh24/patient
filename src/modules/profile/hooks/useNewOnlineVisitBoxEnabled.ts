import { useFeatureIsOn, useFeatureValue, useGrowthBook } from '@growthbook/growthbook-react';
import { useLayoutEffect, useState } from 'react';
import {
  NEW_ONLINE_VISIT_BOX_FEATURE,
  isNewOnlineVisitBoxEnabled,
} from '@/modules/profile/utils/isNewOnlineVisitBoxEnabled';

/** Same GrowthBook gate as profile online-visit box (`new_onlinevisit_box` by doctor slug). */
export const useNewOnlineVisitBoxEnabled = (slug?: string | null): boolean => {
  const growthbook = useGrowthBook();
  const featureValue = useFeatureValue<unknown>(NEW_ONLINE_VISIT_BOX_FEATURE, { slugs: [] });
  const featureFromHook = useFeatureIsOn(NEW_ONLINE_VISIT_BOX_FEATURE);
  const [featureFromSlugAttr, setFeatureFromSlugAttr] = useState(false);

  useLayoutEffect(() => {
    if (!growthbook || !slug) {
      setFeatureFromSlugAttr(false);
      return;
    }
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      slug,
    });
    setFeatureFromSlugAttr(growthbook.isOn(NEW_ONLINE_VISIT_BOX_FEATURE));
  }, [growthbook, slug, growthbook?.ready, featureFromHook]);

  if (!slug) return false;
  return isNewOnlineVisitBoxEnabled(featureValue, slug, featureFromHook || featureFromSlugAttr);
};
