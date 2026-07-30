import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { getProfileMicroserviceConfig } from '@/common/apis/clients/profileMicroserviceClient';

export const PROFILE_API_SOURCE_FEATURE_KEY = 'profile.api-source-by-slug';

export function isSlugInProfileApiSourceAllowlist(slugs: string[] | undefined, slug: string): boolean {
  return newApiFeatureFlaggingCondition(slugs ?? [], slug);
}

/**
 * Client-safe allowlist check (no GrowthBook / no node:crypto).
 * - Prefer GrowthBook slugs passed by the caller (SSR or useFeatureValue).
 * - Else fall back to PROFILE_API_SOURCE_SLUGS (local only).
 */
export function isProfileMicroserviceEnabledForSlug(slug: string, growthbookSlugs?: string[]): boolean {
  const { baseURL, envSlugs } = getProfileMicroserviceConfig();
  if (!baseURL) return false;
  const slugs = growthbookSlugs && growthbookSlugs.length > 0 ? growthbookSlugs : envSlugs;
  return isSlugInProfileApiSourceAllowlist(slugs, slug);
}
