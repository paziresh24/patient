import { ReviewParams, useGetReview } from '@/common/apis/services/reviews/getReviews';
import { Fragment } from '@/common/fragment';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { useCallback, useEffect, useState } from 'react';
import DoctorTags from './doctorTags';
import RaviGlobalContextsProvider from '../../../../../.plasmic/plasmic/ravi_r_r/PlasmicGlobalContextsProvider';

export const FragmentRateReview = ({ profileData }: { profileData: any }) => {
  const [sort, setSort] = useState<'created_at' | 'count_like' | 'default_order'>('default_order');
  const userInfo = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParams, setFilterParams] = useState({});
  const [response, setResponse] = useState(profileData.feedbacks?.feedbacks?.list ?? []);
  const [pageInfo, setPageInfo] = useState(profileData.feedbacks?.feedbacks?.pageInfo);
  const [page, setPage] = useState(1);
  const listOfShowDoctorTags = useFeatureValue('profile:doctor-tags|enabled', { slugs: [] });
  const shouldShowDoctorTags = newApiFeatureFlaggingCondition(listOfShowDoctorTags?.slugs, profileData.seo.slug);
  const dontShowRateDetails = useFeatureIsOn('ravi_show_external_rate');
  const getFeedbacks = useGetReview(
    {
      slug: profileData.seo.slug,
      sort,
      search: searchTerm,
      offset: (page - 1) * 10,
      showOnlyPositiveFeedbacks: isLogin && userInfo?.id === profileData.information.user_id ? false : true,
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

  const onSort = useCallback((value: 'created_at' | 'count_like' | 'default_order') => {
    setPage(1);
    setSort(value);
  }, []);
  const items = [
    {
      label: 'برخورد مناسب پزشک',
      value: profileData?.feedbacks?.details?.average_rates?.average_doctor_encounter,
    },
    {
      label: 'توضیح پزشک در هنگام ویزیت',
      value: profileData?.feedbacks?.details?.average_rates?.average_explanation_of_issue,
    },
    {
      label: 'مهارت و تخصص پزشک',
      value: profileData?.feedbacks?.details?.average_rates?.average_quality_of_treatment,
    },
  ];

  return (
    <RaviGlobalContextsProvider>
      <div className="flex flex-col space-y-1">
        {!dontShowRateDetails && (
          <div className="w-full space-y-3 p-4 bg-white md:rounded-t-lg flex flex-col justify-center items-center">
            <Fragment
              name="RateAndCommentCount"
              props={{
                ...profileData,
                rate: (
                  (+(profileData?.feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
                    +(profileData?.feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
                    +(profileData?.feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
                  3
                ).toFixed(1),
                rateCount: profileData?.feedbacks?.details?.count_of_feedbacks,
                hideRates: profileData?.feedbacks?.details?.hide_rates,
              }}
            />
            <Fragment
              name="RateProgressList"
              props={{
                ...profileData,
                items: items,
                hideRates: profileData?.feedbacks?.details?.hide_rates,
              }}
            />
          </div>
        )}
        {shouldShowDoctorTags && (
          <DoctorTags
            symptomes={profileData?.symptomes?.slice?.(0, 5) ?? []}
            doctorId={profileData?.information?.id}
            serverId={profileData?.information?.server_id}
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
            hideRates: profileData.feedbacks?.details?.hide_rates,
          }}
        />
      </div>
    </RaviGlobalContextsProvider>
  );
};

