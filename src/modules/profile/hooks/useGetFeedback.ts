import { useEffect } from 'react';
import { FeedbackParams, useGetFeedbacks } from '../../../common/apis/services/rate/getFeedbacks';
import { useFeedbackDataStore } from '../store/feedbackData';

export const useGetFeedbackData = (filterItem: FeedbackParams) => {
  const setFeedbackInfo = useFeedbackDataStore(state => state.setData);
  const getFeedbacks = useGetFeedbacks({
    ...filterItem,
  });
  useEffect(() => {
    if (getFeedbacks.isSuccess) {
      setFeedbackInfo(getFeedbacks.data?.data?.result);
    }
  }, [getFeedbacks.status]);

  return { feedbacks: getFeedbacks.data, isLoading: getFeedbacks.isLoading };
};
