import { ReviewParams, useGetReview } from '@/common/apis/services/reviews/getReviews';
import { Fragment } from '@/common/fragment';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useCallback, useEffect, useState } from 'react';
import DoctorTags from './doctorTags';

export const FragmentRateReview = ({ profileData }: { profileData: any }) => {
  const [sort, setSort] = useState<'created_at' | 'count_like'>('created_at');
  const userInfo = useUserInfoStore(state => state.info);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParams, setFilterParams] = useState({});
  const [response, setResponse] = useState(profileData.feedbacks?.feedbacks?.list ?? []);
  const [pageInfo, setPageInfo] = useState(profileData.feedbacks?.feedbacks?.pageInfo);
  const [page, setPage] = useState(1);
  const listOfShowDoctorTags = useFeatureValue('profile:doctor-tags|enabled', { slugs: [] });
  const shouldShowDoctorTags = newApiFeatureFlaggingCondition(listOfShowDoctorTags?.slugs, profileData.seo.slug);

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
    },
  );

  useEffect(() => {
    if (getFeedbacks.data) {
      setPageInfo(getFeedbacks.data?.pageInfo);
      setResponse(page > 1 ? [...response, ...getFeedbacks.data.list] : getFeedbacks.data.list);
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

  const onSort = useCallback((value: 'created_at' | 'count_like') => {
    setPage(1);
    setSort(value);
  }, []);

  return (
    <div className="flex flex-col space-y-1">
      <div className="w-full space-y-3 p-4 bg-white md:rounded-t-lg flex flex-col justify-center items-center">
        <Fragment
          name="RateAndCommentCount"
          props={{
            ...profileData,
            rate: (
              ((+profileData.feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
                (+profileData.feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
                (+profileData.feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
              3
            ).toFixed(1),
            rateCount: profileData.feedbacks.details?.count_of_feedbacks,
          }}
        />
        <Fragment
          name="RateProgressBar"
          props={{
            ...profileData,
            averageQualityOfTreatment: profileData.feedbacks.details.average_rates.average_quality_of_treatment,
            averageDoctorEncounter: profileData.feedbacks.details.average_rates.average_doctor_encounter,
            averageExplanationOfIssue: profileData.feedbacks.details.average_rates.average_explanation_of_issue,
          }}
        />
      </div>
      {shouldShowDoctorTags && (
        <DoctorTags
          symptomes={profileData.symptomes?.slice?.(0, 5) ?? []}
          doctorId={profileData.information.id}
          serverId={profileData.information.server_id}
        />
      )}
      <Fragment
        name="ReviewList"
        props={{
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
        }}
      />
    </div>
  );
};
