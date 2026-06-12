import { apiGatewayClient } from '@/common/apis/client';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

/**
 * این endpointها دقیقاً از کامپوننت فعلیِ ریویوی پروفایل پزشک گرفته شده‌اند
 * (ReviewCard2 → RaviReviewCard / ReviewOptions / ReviewReply / RaviShare).
 */

/** نام نظردهنده — GET /v1/users/{userId} → users[0].name */
export const useReviewerName = (userId?: string | number) =>
  useQuery(
    ['doctorHome', 'reviewerName', String(userId ?? '')],
    async () => {
      const { data } = await apiGatewayClient.get(`/v1/users/${userId}`);
      const users = (data?.users ?? data?.data?.users) as Array<Record<string, unknown>> | undefined;
      const name = users?.[0]?.name;
      return typeof name === 'string' && name.trim() ? name.trim() : null;
    },
    { enabled: userId != null && userId !== '', staleTime: 30 * 60 * 1000, retry: 0 },
  );

export interface FeedbackReply {
  id: string;
  description: string;
}

export const FEEDBACK_REPLY_KEY = (slug?: string, feedbackId?: string) =>
  ['doctorHome', 'feedbackReply', slug ?? '', feedbackId ?? ''] as const;

/**
 * پاسخ موجودِ پزشک به نظر.
 * GET /ravi/v1/ravi_get_reply?where=(doctor_slug,eq,{slug})~and(reply_to_feedback_id,eq,{feedbackId})...
 */
export const useFeedbackReply = (slug?: string, feedbackId?: string, enabled = true) =>
  useQuery(
    FEEDBACK_REPLY_KEY(slug, feedbackId),
    async (): Promise<FeedbackReply | null> => {
      const where =
        `(doctor_slug,eq,${slug})` +
        `~and(reply_to_feedback_id,eq,${feedbackId})` +
        `~and(show,eq,1)~and(delete,eq,0)~and(description,isnot,null)`;
      const { data } = await apiGatewayClient.get('/ravi/v1/ravi_get_reply', {
        params: { where, limit: 1, offset: 0, sort: '-created_at' },
      });
      const item = (data?.list as Array<Record<string, unknown>> | undefined)?.[0];
      if (!item?.description) return null;
      return { id: String(item.Id ?? item.id ?? ''), description: String(item.description) };
    },
    { enabled: enabled && !!slug && !!feedbackId, staleTime: 60 * 1000, retry: 0 },
  );

/**
 * ثبت پاسخ پزشک:
 * POST /ravi/v1/feedbacks/reply?id={feedbackId}  body {feedback_id, description}
 * + webhook اطلاع‌رسانی: POST /ravi/v1/reply-webhook?id={feedbackId}
 */
export const submitReply = async ({
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

export const useSubmitReply = () => useMutation(submitReply);

/** ویرایش پاسخ: PATCH /ravi/v2/feedbacks?id={replyId}  body {description} */
export const editReply = async ({ replyId, description }: { replyId: string; description: string }) =>
  apiGatewayClient.patch(`/ravi/v2/feedbacks?id=${replyId}`, { description }, { withCredentials: true });

export const useEditReply = () => useMutation(editReply);

/** حذف پاسخ: DELETE /ravi/v1/feedbacks/{replyId} */
export const deleteReply = async ({ replyId }: { replyId: string }) =>
  apiGatewayClient.delete(`/ravi/v1/feedbacks/${replyId}`, { withCredentials: true });

export const useDeleteReply = () => useMutation(deleteReply);

/**
 * گزارش نظر:
 * POST /ravi/v1/feedbacks/report?id={feedbackId}  body {feedback_id, report_text}
 * + webhook: POST /ravi/v1/report-webhook?id={feedbackId}
 */
export const reportFeedback = async ({
  feedbackId,
  reportText,
  commentText,
  doctorSlug,
}: {
  feedbackId: string;
  reportText: string;
  commentText?: string;
  doctorSlug?: string;
}) => {
  const res = await apiGatewayClient.post(
    `/ravi/v1/feedbacks/report?id=${feedbackId}`,
    { feedback_id: feedbackId, report_text: reportText },
    { withCredentials: true },
  );
  apiGatewayClient
    .post(
      `/ravi/v1/report-webhook?id=${feedbackId}`,
      { feedback_id: feedbackId, report_text: reportText, comment_text: commentText, doctor_slug: doctorSlug },
      { withCredentials: true },
    )
    .catch(() => undefined);
  return res;
};

export const useReportFeedback = () => useMutation(reportFeedback);

/** لینک اشتراک‌گذاری نظر — GET /ravi/v1/share_comment?slug={slug}&id={feedbackId} → url */
export const useShareCommentUrl = (slug?: string, feedbackId?: string, enabled = true) =>
  useQuery(
    ['doctorHome', 'shareComment', slug ?? '', feedbackId ?? ''],
    async (): Promise<string | null> => {
      const { data } = await apiGatewayClient.get('/ravi/v1/share_comment', {
        params: { slug, id: feedbackId },
      });
      const url = (data?.url ?? data?.data?.url ?? data?.link) as string | undefined;
      return typeof url === 'string' && url ? url : null;
    },
    { enabled: enabled && !!slug && !!feedbackId, staleTime: 5 * 60 * 1000, retry: 0 },
  );

/**
 * مجموعه‌ی آی‌دیِ نظرهایی که پزشک بهشون پاسخ داده — با یک query.
 * GET /ravi/v1/ravi_get_reply?where=(doctor_slug,eq,{slug})~and(reply_to_feedback_id,isnot,null)...
 * برای تشخیص نظرهای «بی‌پاسخ» در فید استفاده میشه.
 */
export const useAnsweredFeedbackIds = (slug?: string) =>
  useQuery(
    ['doctorHome', 'answeredFeedbackIds', slug ?? ''],
    async (): Promise<Set<string>> => {
      const where =
        `(doctor_slug,eq,${slug})` +
        `~and(reply_to_feedback_id,isnot,null)` +
        `~and(show,eq,1)~and(delete,eq,0)`;
      const { data } = await apiGatewayClient.get('/ravi/v1/ravi_get_reply', {
        params: { where, limit: 200, offset: 0, sort: '-created_at' },
      });
      const list = (data?.list as Array<Record<string, unknown>> | undefined) ?? [];
      const set = new Set<string>();
      list.forEach(it => {
        const id = it.reply_to_feedback_id;
        if (id != null && id !== '') set.add(String(id));
      });
      return set;
    },
    { enabled: !!slug, staleTime: 60 * 1000, retry: 0 },
  );

const REVIEWS_PAGE_SIZE = 10;

interface ReviewsPage {
  list: Array<Record<string, unknown>>;
  pageInfo?: { page?: number; isLastPage?: boolean };
}

/**
 * همه‌ی نظرهای پروفایل به‌ترتیب ثبت، با صفحه‌بندی واقعی (offset).
 * هر صفحه ۱۰ تا؛ تا وقتی isLastPage نشده یا صفحه پر بوده، صفحه‌ی بعد لود میشه.
 */
export const useReviewsInfinite = (slug?: string) =>
  useInfiniteQuery(
    ['doctorHome', 'reviewsInfinite', slug ?? ''],
    async ({ pageParam = 0 }): Promise<ReviewsPage> => {
      const data = await getReviews({ slug, sort: 'created_at', offset: pageParam });
      return data as ReviewsPage;
    },
    {
      enabled: !!slug,
      staleTime: 60 * 1000,
      getNextPageParam: (lastPage, pages) => {
        const list = lastPage?.list ?? [];
        const isLast = lastPage?.pageInfo?.isLastPage ?? list.length < REVIEWS_PAGE_SIZE;
        return isLast ? undefined : pages.length * REVIEWS_PAGE_SIZE;
      },
    },
  );

/** دلایل پیش‌فرض گزارش نظر (آخرین گزینه آزاد/متنی است) */
export const REPORT_REASONS = [
  'محتوای توهین‌آمیز یا نامناسب',
  'تبلیغات یا اسپم',
  'اطلاعات نادرست یا خلاف واقع',
  'بی‌ارتباط با ویزیت',
  'موارد دیگر',
] as const;
