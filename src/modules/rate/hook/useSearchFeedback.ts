import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import { useState } from 'react';
import { FeedbackParams, getFeedbacks } from '../../../common/apis/services/rate/getFeedbacks';
import { useFeedbackDataStore } from '../store/feedbackData';

export const useRateFilter = () => {
  const setFeedbackInfo = useFeedbackDataStore(state => state.setData);
  const [filterParams, setFilterParams] = useState<FeedbackParams>({
    doctor_id: '540',
    server_id: '1',
  });

  const getSearchFeedback = async (filterItems: FeedbackParams) => {
    const { data } = await getFeedbacks({
      ...filterItems,
    });
    setFeedbackInfo(data.result);
  };

  const rateSearch = debounce((text: string) => {
    !text && delete filterParams.search;
    setFilterParams(prve => ({ ...prve, ...(text.trim() && { search: text }) }));
    getSearchFeedback(filterParams);
  }, 10);

  const rateSortFilter = debounce((order: string) => {
    setFilterParams(prve => ({ ...prve, order_by: order }));
    getSearchFeedback({ ...filterParams, order_by: order });
  }, 10);

  const rateFilterType = debounce((type: 'my_feedbacks' | 'has_nobat' | 'center_id' | 'all') => {
    const removeFilters = omit(filterParams, ['has_nobat', 'my_feedbacks', 'center_id']);
    const filterTypes = {
      my_feedbacks: { my_feedbacks: true },
      has_nobat: { has_nobat: true },
      center_id: { center_id: type },
      all: {},
    };
    setFilterParams({ ...removeFilters, ...filterTypes[type] });
    getSearchFeedback({ ...removeFilters, ...filterTypes[type] });
  }, 10);

  return { rateSearch, rateSortFilter, rateFilterType };
};
