import { getReviews } from '@/common/apis/services/reviews/getReviews';

type GetReviewsData = { external_id: string };

export const getReviewsData = async ({ external_id }: GetReviewsData) => {
  const { data: response } = await getReviews({ external_id });

  return {
    ...response.post_stream.posts,
  };
};
