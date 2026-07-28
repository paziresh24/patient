import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { RaviWidget } from '@/modules/rate-and-review';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { useMemo } from 'react';
import DoctorTags from './doctorTags';

export const FragmentRateReview = ({ profileData }: { profileData: any }) => {
  const listOfShowDoctorTags = useFeatureValue('profile:doctor-tags|enabled', { slugs: [] });
  const shouldShowDoctorTags = newApiFeatureFlaggingCondition(listOfShowDoctorTags?.slugs, profileData.seo.slug);
  const dontShowRateDetails = useFeatureIsOn('ravi_show_external_rate');

  const centers = useMemo(
    () =>
      (profileData?.centers ?? [])
        .filter((center: { id?: unknown; name?: string }) => center?.id && center?.name)
        .map((center: { id: unknown; name: string }) => ({
          id: String(center.id),
          name: center.name,
        })),
    [profileData?.centers],
  );

  return (
    <div className="flex flex-col space-y-1">
      {shouldShowDoctorTags ? (
        <DoctorTags
          symptomes={profileData?.symptomes?.slice?.(0, 5) ?? []}
          doctorId={profileData?.information?.id}
          serverId={profileData?.information?.server_id}
        />
      ) : null}
      <RaviWidget
        doctorSlug={profileData.seo.slug}
        doctorUserId={profileData?.information?.id != null ? String(profileData.information.id) : undefined}
        displayName={profileData?.information?.display_name}
        centers={centers}
        hideSummary={dontShowRateDetails}
      />
    </div>
  );
};
