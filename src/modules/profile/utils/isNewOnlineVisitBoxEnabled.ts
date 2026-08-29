import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';

export const NEW_ONLINE_VISIT_BOX_FEATURE = 'new_onlinevisit_box';

export const extractNewOnlineVisitBoxSlugs = (featureValue: unknown): string[] => {
  if (Array.isArray(featureValue)) {
    return featureValue.filter((item): item is string => typeof item === 'string' && item.length > 0);
  }

  if (featureValue && typeof featureValue === 'object' && Array.isArray((featureValue as { slugs?: unknown }).slugs)) {
    return ((featureValue as { slugs: unknown[] }).slugs).filter(
      (item): item is string => typeof item === 'string' && item.length > 0,
    );
  }

  return [];
};

export const isNewOnlineVisitBoxEnabled = (featureValue: unknown, slug: string, isOn = false): boolean => {
  if (!slug) return false;

  const slugs = extractNewOnlineVisitBoxSlugs(featureValue);
  if (slugs.length > 0) return newApiFeatureFlaggingCondition(slugs, slug);

  return isOn;
};

export const slugsFromGrowthBookOnlineVisitBoxFeature = (feature: {
  defaultValue?: unknown;
  rules?: Array<{ condition?: { slug?: unknown }; force?: unknown }>;
}): string[] => {
  const slugs = new Set<string>(extractNewOnlineVisitBoxSlugs(feature?.defaultValue));

  for (const rule of feature?.rules ?? []) {
    if (rule.force !== true && rule.force !== 1) continue;
    const slugCond = rule.condition?.slug;
    if (typeof slugCond === 'string' && slugCond) slugs.add(slugCond);
    if (slugCond && typeof slugCond === 'object' && Array.isArray((slugCond as { $in?: unknown }).$in)) {
      for (const item of (slugCond as { $in: unknown[] }).$in) {
        if (typeof item === 'string' && item) slugs.add(item);
      }
    }
  }

  return [...slugs];
};
