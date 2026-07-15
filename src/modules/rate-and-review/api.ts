import { apiGatewayClient, raviApisClient } from '@/common/apis/client';
import { enrichReviewResponseWithRelativeTime } from '@/common/utils/formatRelativeFeedbackTime';
import axios from 'axios';
import { RaviFeedbackReply, RaviRateSummary, RaviReviewPage, RaviReviewQuery } from './types';

export const isRateSummaryNotFound = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.data?.error?.code === 'RATE_NOT_FOUND';

const PAGE_SIZE = 10;

interface RaviFeedbacksResponse {
  data?: Array<Record<string, unknown>>;
  list?: Array<Record<string, unknown>>;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
    total?: number;
    hasNext?: boolean;
  };
  pageInfo?: RaviReviewPage['pageInfo'];
}

export const fetchRateSummary = async (doctorSlug: string): Promise<RaviRateSummary | null> => {
  try {
    const { data } = await raviApisClient.get<Record<string, unknown>>(
      `/ravi/v1/rate/doctor/${encodeURIComponent(doctorSlug)}`,
      { timeout: 12_000 },
    );

    return {
      hideRates: Boolean(data?.hide_rates ?? data?.hide),
      count: Number(data?.comments_count ?? data?.count_rates ?? 0),
      items: [
        { label: 'برخورد مناسب', value: Number(data?.doctor_encounter) || 0 },
        { label: 'توضیح در هنگام ویزیت', value: Number(data?.explanation_of_issue) || 0 },
        { label: 'مهارت و تخصص', value: Number(data?.quality_of_treatment) || 0 },
      ],
    };
  } catch (error) {
    if (isRateSummaryNotFound(error)) {
      return null;
    }
    throw error;
  }
};

/** GET /ravi/v1/feedbacks/doctors/{slug} — feedbacks webservice (filter: default | newest | negative). */
export const fetchReviewPage = async (doctorSlug: string, query: RaviReviewQuery): Promise<RaviReviewPage> => {
  const { data } = await raviApisClient.get<RaviFeedbacksResponse>(
    `/ravi/v1/feedbacks/doctors/${encodeURIComponent(doctorSlug)}`,
    {
      params: {
        filter: query.filter,
        limit: query.limit || PAGE_SIZE,
        offset: query.offset,
        user_id: query.userId,
        center_id: query.centerId,
      },
    },
  );
  const rawList = data?.data ?? data?.list ?? [];
  const list = enrichReviewResponseWithRelativeTime(rawList);
  const pageInfo = {
    ...data?.pageInfo,
    page: Math.floor((data?.meta?.offset ?? query.offset) / (query.limit || PAGE_SIZE)) + 1,
    total: data?.meta?.total ?? data?.pageInfo?.total,
    isLastPage: data?.meta?.hasNext != null ? !data.meta.hasNext : data?.pageInfo?.isLastPage,
  };
  const hasMore = pageInfo.isLastPage != null ? !pageInfo.isLastPage : list.length >= (query.limit || PAGE_SIZE);

  return { list, hasMore, pageInfo };
};

export { PAGE_SIZE };

export const fetchReviewerName = async (userId: string): Promise<string | null> => {
  const info = await fetchReviewerInfo(userId);
  return info.name;
};

export const fetchReviewerInfo = async (
  userId: string,
): Promise<{ name: string | null; family: string | null }> => {
  const { data } = await apiGatewayClient.get(`/v1/users/${userId}`);
  const users = (data?.users ?? data?.data?.users) as Array<Record<string, unknown>> | undefined;
  const user = users?.[0];
  const name = user?.name;
  const family = user?.family;
  return {
    name: typeof name === 'string' && name.trim() ? name.trim() : null,
    family: typeof family === 'string' && family.trim() ? family.trim() : null,
  };
};

/**
 * GET /ravi/v1/ravi_get_reply — پاسخ پزشک به یک نظر (مطابق ReviewCard2 در Plasmic / Apidog).
 * where: doctor_slug + reply_to_feedback_id + show=1 + delete=0 + description is not null
 */
export const fetchFeedbackReply = async (
  doctorSlug: string,
  feedbackId: string,
): Promise<RaviFeedbackReply | null> => {
  const where =
    `(doctor_slug,eq,${doctorSlug})` +
    `~and(reply_to_feedback_id,eq,${feedbackId})` +
    `~and(show,eq,1)~and(delete,eq,0)~and(description,isnot,null)`;
  const { data } = await apiGatewayClient.get('/ravi/v1/ravi_get_reply', {
    params: { where, limit: 1, offset: 0, sort: '-created_at' },
  });
  const item = (data?.list as Array<Record<string, unknown>> | undefined)?.[0];
  if (!item?.description) return null;
  return {
    id: String(item.Id ?? item.id ?? ''),
    description: String(item.description),
    userId: item.user_id != null ? String(item.user_id) : undefined,
  };
};

export const submitLikeRate = async ({
  feedbackId,
  rate,
  userId,
}: {
  feedbackId: string;
  rate: number;
  userId: string;
}) =>
  raviApisClient.post(
    `/ravi/v1/feedbacks/${encodeURIComponent(feedbackId)}/likes`,
    { rate, user_id: userId },
    { withCredentials: true },
  );

export const editFeedback = async ({ feedbackId, description }: { feedbackId: string; description: string }) =>
  raviApisClient.patch(`/ravi/v2/feedbacks?id=${encodeURIComponent(feedbackId)}`, { description }, { withCredentials: true });

export const deleteFeedback = async (feedbackId: string) =>
  raviApisClient.delete(`/ravi/v1/feedbacks/${encodeURIComponent(feedbackId)}`, { withCredentials: true });

export const reportFeedback = async ({
  feedbackId,
  slug,
  feedbackDescription,
  reportDescription,
  reportReason,
  userId,
}: {
  feedbackId: string;
  slug: string;
  feedbackDescription: string;
  reportDescription: string;
  reportReason: string;
  userId?: string;
}) =>
  apiGatewayClient.post(
    '/ravi/v3/report',
    {
      ...(userId ? { user_id: userId } : {}),
      slug,
      feedback_id: feedbackId,
      feedback_description: feedbackDescription,
      report_description: reportDescription,
      report_reason: reportReason,
    },
    { withCredentials: true },
  );

export const submitFeedbackReply = async ({
  feedbackId,
  description,
  doctorId,
}: {
  feedbackId: string;
  description: string;
  doctorId?: string;
}) => {
  const res = await apiGatewayClient.post(
    `/ravi/v1/feedbacks/reply?id=${feedbackId}`,
    { feedback_id: feedbackId, description },
    { withCredentials: true },
  );
  apiGatewayClient
    .post(
      `/ravi/v1/reply-webhook?id=${feedbackId}`,
      { doctor_id: doctorId, comment_id: feedbackId, reply_text: description },
      { withCredentials: true },
    )
    .catch(() => undefined);
  return res;
};

export const editFeedbackReply = async ({ replyId, description }: { replyId: string; description: string }) =>
  apiGatewayClient.patch(`/ravi/v2/feedbacks?id=${replyId}`, { description }, { withCredentials: true });

export const deleteFeedbackReply = async (replyId: string) =>
  apiGatewayClient.delete(`/ravi/v1/feedbacks/${replyId}`, { withCredentials: true });

/** GET /ravi/v1/share/doctors/{slug}/{commentId} → { url } */
export const fetchShareCommentUrl = async (doctorSlug: string, commentId: string): Promise<string | null> => {
  const { data } = await raviApisClient.get(
    `/ravi/v1/share/doctors/${encodeURIComponent(doctorSlug)}/${encodeURIComponent(commentId)}`,
  );
  const url = (data?.url ?? data?.data?.url ?? data?.link) as string | undefined;
  return typeof url === 'string' && url ? url : null;
};
