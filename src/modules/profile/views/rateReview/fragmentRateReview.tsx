import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import useClientReady from '@/common/hooks/useClientReady';
import { enrichReviewResponseWithRelativeTime } from '@/common/utils/formatRelativeFeedbackTime';
import { RaviWidget } from '@/modules/rate-and-review';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { useMemo } from 'react';
import DoctorTags from './doctorTags';
import ProfileSectionCard from '../profileSectionCard';
import CommentIcon from '@/common/components/icons/comment';

export const FragmentRateReview = ({ profileData }: { profileData: any }) => {
  const isClientReady = useClientReady();
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

  const initialReviewPage = useMemo(() => {
    const ssrFeedbacks = profileData?.feedbacks?.feedbacks;
    if (!Array.isArray(ssrFeedbacks?.list) || ssrFeedbacks.list.length === 0) return undefined;

    return {
      list: enrichReviewResponseWithRelativeTime(ssrFeedbacks.list),
      hasMore: ssrFeedbacks.pageInfo?.isLastPage != null ? !ssrFeedbacks.pageInfo.isLastPage : ssrFeedbacks.list.length >= 10,
      pageInfo: ssrFeedbacks.pageInfo,
    };
  }, [profileData?.feedbacks?.feedbacks]);

  if (!isClientReady) {
    return null;
  }

  return (
    <ProfileSectionCard title="نظرات بیماران" icon={<CommentIcon width={18} height={18} />}>
      <div className="flex flex-col space-y-3 px-4 md:px-0">
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
          initialReviewPage={initialReviewPage}
        />
      </div>
    </ProfileSectionCard>
  );
};
