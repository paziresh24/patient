import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import { useEffect, useState } from 'react';
import { FeedbackParams, useGetFeedbacks } from '../../../common/apis/services/rate/getFeedbacks';
import { useFeedbackDataStore } from '../store/feedbackData';
import { useRouter } from 'next/router';

export const useGetFeedbackData = (filterItem: FeedbackParams) => {
  const setFeedbackInfo = useFeedbackDataStore(state => state.setData);
  const feedbackInfo = useFeedbackDataStore(state => state.data);
  const [page, setPage] = useState<number>(1);
  const [filterParams, setFilterParams] = useState<FeedbackParams>({
    ...filterItem,
  });
  const getFeedbacks = useGetFeedbacks(
    {
      ...filterParams,
      ...(typeof window !== 'undefined' && window.location.hash && { id: window.location.hash?.split('-')?.[1] }),
    },
    {
      refetchOnMount: false,
    },
  );

  const sliceFeedbacks = (feedbacks: any[]) => {
    const feedbackId = window.location.hash.split('-');
    return feedbackId ? feedbacks.filter(item => item.id === feedbackId) : feedbacks;
  };

  useEffect(() => {
    if (getFeedbacks.data) {
      setFeedbackInfo(page > 1 ? [...feedbackInfo, ...(getFeedbacks.data?.result ?? [])] : getFeedbacks.data?.result ?? []);
    }
  }, [getFeedbacks.data, getFeedbacks.status]);

  const rateSearch = debounce((text: string) => {
    setPage(1);
    setFilterParams(prev => {
      if (text.trim()) return { ...prev, search: text.trim() };
      return omit(prev, 'search');
    });
  }, 250);

  const rateSortFilter = debounce((order: string) => {
    setPage(1);
    setFilterParams(prev => ({ ...prev, order_by: order }));
  }, 10);

  const rateFilterType = debounce((type: 'my_feedbacks' | 'has_nobat' | 'all') => {
    const removeFilters = omit(filterParams, ['has_nobat', 'my_feedbacks']);
    const filterTypes = {
      my_feedbacks: { my_feedbacks: true },
      has_nobat: { has_nobat: true },
      all: {},
    };
    setPage(1);
    setFilterParams({ ...removeFilters, ...(filterTypes[type] ?? { center_id: type }) });
  }, 10);

  const showMore = () => {
    setFilterParams({ ...filterParams, page: page + 1 });
    setPage(prev => prev + 1);
  };

  return {
    feedbacks: getFeedbacks.data,
    showMoreButtonLoading: page > 1 && getFeedbacks.isLoading,
    isLoading: getFeedbacks.isLoading,
    rateSearch,
    rateSortFilter,
    rateFilterType,
    showMore,
    message: getFeedbacks.data.status === 'ERROR' && getFeedbacks.data.message,
  };
};
