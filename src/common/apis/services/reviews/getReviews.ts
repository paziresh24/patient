import { raviApiClient } from '@/common/apis/client';
import { buildNocoDbDateTimeRangeClauses } from '@/common/utils/nocodbDateFilter';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

export interface ReviewParams {
  slug?: string;
  sort?: 'default_order' | 'created_at' | 'count_like';
  search?: string;
  user_id?: string;
  not_recommended?: boolean;
  visited?: boolean;
  center_id?: string;
  offset?: number;
  book_id?: string;
  /** بازه UTC برای فیلتر NocoDB exactDate روی created_at */
  createdAtFrom?: string;
  createdAtTo?: string;
  limit?: number;
}

export const getReviews = async (params: ReviewParams) => {
  const { data } = await raviApiClient.get(`/ravi/v1/feedbacks`, {
    params: {
      where: [
        params.slug && `(doctor_slug,eq,${params.slug})`,
        params.search && `(description,like,${params.search})`,
        params.user_id && `(user_id,eq,${params.user_id})`,
        params.not_recommended && `(recommended,eq,0)`,
        params.visited && `(visit_status,eq,visited)`,
        params.center_id && `(center_id,eq,${params.center_id})`,
        params.book_id && `(book_id,eq,${params.book_id})`,
        ...buildNocoDbDateTimeRangeClauses('created_at', params.createdAtFrom ?? '', params.createdAtTo ?? ''),
      ]
        .filter(Boolean)
        .join('~and'),
      limit: params.limit ?? 10,
      offset: params?.offset ?? 0,
      ...(params.sort && { sort: `-${params.sort}` }),
    },
    withCredentials: false
  });
  return data;
};

export const useGetReview = (params: ReviewParams, options?: any) =>
  useQuery([ServerStateKeysEnum.Feedbacks, params], () => getReviews(params), options);
