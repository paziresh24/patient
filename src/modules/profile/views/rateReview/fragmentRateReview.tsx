import { ReviewParams, useGetReview } from '@/common/apis/services/reviews/getReviews';
import { Fragment2 } from '@/common/fragment/fragment2';
import { enrichReviewResponseWithRelativeTime } from '@/common/utils/formatRelativeFeedbackTime';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { RaviWidget } from '@/modules/rate-and-review';
import { useNewRaviWithAi } from '@/modules/rate-and-review/composables/useNewRaviWithAi';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DoctorTags from './doctorTags';
import RaviGlobalContextsProvider from '../../../../../.plasmic/plasmic/ravi_r_r/PlasmicGlobalContextsProvider';
import PlasmicReviewRateAndReviews from '.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndReviews';
import ReviewList2 from '.plasmic/ReviewList2';

export const FragmentRateReview = ({ profileData }: { profileData: any }) => {
  const [sort, setSort] = useState<'created_at' | 'count_like' | 'default_order'>('default_order');
  const userInfo = useUserInfoStore(state => state.info);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParams, setFilterParams] = useState({});
  const [response, setResponse] = useState(() =>
    enrichReviewResponseWithRelativeTime(profileData.feedbacks?.feedbacks?.list ?? []),
  );
  const [pageInfo, setPageInfo] = useState(profileData.feedbacks?.feedbacks?.pageInfo);
  const [page, setPage] = useState(1);
  const listOfShowDoctorTags = useFeatureValue('profile:doctor-tags|enabled', { slugs: [] });
  const shouldShowDoctorTags = newApiFeatureFlaggingCondition(listOfShowDoctorTags?.slugs, profileData.seo.slug);
  const showNewRaviWithAi = useNewRaviWithAi();
  const dontShowRateDetails = useFeatureIsOn('ravi_show_external_rate');
  const newProgressList = useFeatureIsOn('ravi_show_new_progress_list');
  const newRateAndCommentCount = useFeatureIsOn('ravi_show_new_rate_count');
  const newReviewList = useFeatureIsOn('ravi_show_new_Review_comments_list');
  const getFeedbacks = useGetReview(
    {
      slug: profileData.seo.slug,
      sort,
      search: searchTerm,
      offset: (page - 1) * 10,
      ...filterParams,
    },
    {
      refetchOnMount: false,
      enabled: !showNewRaviWithAi.isEnabled,
    },
  );

  useEffect(() => {
    if (showNewRaviWithAi.isEnabled) return;
    if (getFeedbacks.data) {
      setPageInfo(getFeedbacks.data?.pageInfo);
      const list = enrichReviewResponseWithRelativeTime(getFeedbacks.data.list);
      setResponse(page > 1 ? [...response, ...list] : list);
    }
  }, [getFeedbacks.data]);

  const onFilter = useCallback(
    (value: 'my_feedbacks' | 'visited' | 'all' | 'not_recommended') => {
      setPage(1);
      if (value === 'all') {
        setFilterParams({});
        return;
      }

      if (value === 'my_feedbacks') {
        setFilterParams({ user_id: userInfo.id });
        return;
      }

      if (value === 'visited') {
        setFilterParams({ visited: true });
        return;
      }

      if (value === 'not_recommended') {
        setFilterParams({ not_recommended: true });
        return;
      }

      setFilterParams({ center_id: value });
    },
    [userInfo.id],
  );

  const onSearch = useCallback((value: string) => {
    setPage(1);
    setSearchTerm(value);
  }, []);

  const onSort = useCallback((value: 'created_at' | 'count_like' | 'default_order') => {
    setPage(1);
    setSort(value);
  }, []);

  const items = [
    {
      label: 'برخورد مناسب',
      value: profileData?.feedbacks?.details?.average_rates?.average_doctor_encounter,
    },
    {
      label: 'توضیح در هنگام ویزیت',
      value: profileData?.feedbacks?.details?.average_rates?.average_explanation_of_issue,
    },
    {
      label: 'مهارت و تخصص',
      value: profileData?.feedbacks?.details?.average_rates?.average_quality_of_treatment,
    },
  ];

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

  if (showNewRaviWithAi.isEnabled) {
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
  }

  return (
    <div className="flex flex-col space-y-1">
      {!dontShowRateDetails && (
        <Fragment2
          name="RateAndReviews"
          Component={PlasmicReviewRateAndReviews}
          args={{
            ...profileData,
            displayName: profileData?.information?.display_name,
            items,
            rate: (
              (+(profileData?.feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
                +(profileData?.feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
                +(profileData?.feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
              3
            ).toFixed(1),
            rateCount: profileData?.feedbacks?.details?.count_of_feedbacks,
            hideRates: profileData?.feedbacks?.details?.hide_rates,
            hideProgressList: profileData?.feedbacks?.details?.hide_rates,
          }}
        />
      )}

      {shouldShowDoctorTags && (
        <DoctorTags
          symptomes={profileData?.symptomes?.slice?.(0, 5) ?? []}
          doctorId={profileData?.information?.id}
          serverId={profileData?.information?.server_id}
        />
      )}
      {newProgressList ? (
        <Fragment2
          name="ReviewList2"
          Component={ReviewList2}
          args={{
            ...profileData,
            dontShow: false,
            reviewResponse: response,
            pageInfo: pageInfo,
            nextPageTrigger: () => {
              setPage(prev => prev + 1);
            },
            paginationLoadingStatus: page > 1 && getFeedbacks.isLoading,
            onSearch,
            onFilter,
            onSort,
            hideRates: profileData.feedbacks?.details?.hide_rates,
          }}
        />
      ) : (
        <Fragment2
          name="ReviewList"
          Component={ReviewList2}
          args={{
            ...profileData,
            dontShow: false,
            reviewResponse: response,
            pageInfo: pageInfo,
            nextPageTrigger: () => {
              setPage(prev => prev + 1);
            },
            paginationLoadingStatus: page > 1 && getFeedbacks.isLoading,
            onSearch,
            onFilter,
            onSort,
            hideRates: profileData.feedbacks?.details?.hide_rates,
          }}
        />
      )}
    </div>
  );
};

