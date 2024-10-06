import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

export interface ReviewParams {
  slug: string;
  sort: 'default_order' | 'created_at' | 'count_like';
  search?: string;
  user_id?: string;
  not_recommended?: boolean;
  visited?: boolean;
  center_id?: string;
  offset?: number;
  showOnlyPositiveFeedbacks: boolean;
}

export const getReviews = async (params: ReviewParams) => {
  const { data } = await apiGatewayClient.get(`/ravi/v1/feedbacks`, {
    params: {
      where: [
        `(doctor_slug,eq,${params.slug})`,
        `(reply_to_feedback_id,is,null)`,
        params.search && `(description,like,${params.search})`,
        params.user_id && `(user_id,eq,${params.user_id})`,
        params.not_recommended && `(recommended,eq,0)`,
        params.visited && `(visit_status,eq,visited)`,
        params.center_id && `(center_id,eq,${params.center_id})`,
        params.showOnlyPositiveFeedbacks && `(avg_rate_value,gt,3.5)`,
      ]
        .filter(Boolean)
        .join('~and'),
      limit: 10,
      offset: params?.offset ?? 0,
      sort: `-${params.sort}`,
    },
  });
  return data;
};

export const useGetReview = (params: ReviewParams, options?: any) =>
  useQuery([ServerStateKeysEnum.Feedbacks, params], () => getReviews(params), options);
