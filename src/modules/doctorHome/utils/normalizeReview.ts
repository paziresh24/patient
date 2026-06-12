import {
  formatRelativeFeedbackTime,
  getFeedbackCreatedAtValue,
} from '@/common/utils/formatRelativeFeedbackTime';
import { DoctorHomeFeedReview } from '../types/feed';

/**
 * نرمال‌سازی یک آیتم خام feedback (از ravi) به مدل نمایش نظر.
 * مشترک بین فید (بی‌پاسخ‌ها) و لیست صفحه‌بندی‌شده‌ی «همه».
 */
export const mapRawReviewToFeed = (
  item: Record<string, unknown>,
  slug?: string,
): DoctorHomeFeedReview => {
  const rateRaw = item.avg_rate_value ?? item.avgRateValue ?? item.rate ?? item.avg_rate ?? null;
  const rateNum = rateRaw != null && rateRaw !== '' ? Number(rateRaw) : null;

  const nameRaw =
    item.user_name ??
    item.name ??
    item.display_name ??
    item.nik_name ??
    (item.user as Record<string, unknown> | undefined)?.name;

  const likeRaw = item.count_like ?? item.like;
  const likeNum = likeRaw != null && likeRaw !== '' ? Number(likeRaw) : undefined;

  const centerName = item.center_name ?? item.docCenter;

  return {
    id: (item.id ?? item.Id) as string | number | undefined,
    description: item.description as string | undefined,
    recommended: item.recommended as string | number | boolean | undefined,
    relativeCreatedTime: formatRelativeFeedbackTime(getFeedbackCreatedAtValue(item)),
    userId: (item.user_id ?? item.userId) as string | number | undefined,
    userName: typeof nameRaw === 'string' && nameRaw.trim() ? nameRaw.trim() : undefined,
    rate: rateNum != null && Number.isFinite(rateNum) ? rateNum : null,
    centerName: typeof centerName === 'string' && centerName.trim() ? centerName.trim() : undefined,
    visited: item.visit_status === 'visited',
    likeCount: likeNum != null && Number.isFinite(likeNum) ? likeNum : undefined,
    doctorSlug: (item.doctor_slug ?? slug) as string | undefined,
  };
};
