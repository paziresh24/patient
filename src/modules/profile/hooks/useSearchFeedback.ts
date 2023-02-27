import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import { useState } from 'react';
import { FeedbackParams, getFeedbacks } from '../../../common/apis/services/rate/getFeedbacks';
import { useFeedbackDataStore } from '../store/feedbackData';

export const useRateFilter = (doctor_id: string, server_id: string) => {
  const setFeedbackInfo = useFeedbackDataStore(state => state.setData);
  const [page, setPage] = useState<number>(1);
  const feedbacks = useFeedbackDataStore(state => state.data);
  const [filterParams, setFilterParams] = useState<FeedbackParams>({
    doctor_id: doctor_id,
    server_id: server_id,
  });

  const getSearchFeedback = async (filterItems: FeedbackParams, defaultValue = false) => {
    const { data } = await getFeedbacks({
      ...filterItems,
    });
    setFeedbackInfo(defaultValue ? [...feedbacks, ...data.result] : data.result);
  };

  const rateSearch = debounce((text: string) => {
    !text && delete filterParams.search;
    setFilterParams(prve => ({ ...prve, ...(text.trim() && { search: text }) }));
    getSearchFeedback({ ...filterParams, ...(text.trim() && { search: text }) });
  }, 250);

  const rateSortFilter = debounce((order: string) => {
    setFilterParams(prve => ({ ...prve, order_by: order }));
    getSearchFeedback({ ...filterParams, order_by: order });
  }, 10);

  const rateFilterType = debounce((type: 'my_feedbacks' | 'has_nobat' | 'all') => {
    const removeFilters = omit(filterParams, ['has_nobat', 'my_feedbacks']);
    const filterTypes = {
      my_feedbacks: { my_feedbacks: true },
      has_nobat: { has_nobat: true },
      all: {},
    };
    setFilterParams({ ...removeFilters, ...(filterTypes[type] ?? { center_id: type }) });
    getSearchFeedback({ ...removeFilters, ...(filterTypes[type] ?? { center_id: type }) });
  }, 10);

  const showMore = () => {
    getSearchFeedback({ ...filterParams, page: page + 1 }, true);
    setPage(prve => prve + 1);
  };

  return { rateSearch, rateSortFilter, rateFilterType, showMore };
};
