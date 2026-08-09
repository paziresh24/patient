import {
  formatFeedbackLocalTime,
  formatRelativeFeedbackTime,
  getFeedbackCreatedAtValue,
  getFeedbackLocalDateKey,
} from '@/common/utils/formatRelativeFeedbackTime';
import { toPatientFirstName } from '@/modules/rate-and-review/utils/patientFirstName';
import { DoctorHomeFeedReview } from '../types/feed';
import { matchesSelectedCenter } from './centers';

export const isReviewInSelectedDate = (item: Record<string, unknown>, selectedDate: string): boolean =>
  getFeedbackLocalDateKey(getFeedbackCreatedAtValue(item)) === selectedDate;

export const filterReviewsBySelectedCenter = (
  items: Array<Record<string, unknown>>,
  selectedCenterId?: string | null,
) => {
  if (!selectedCenterId) return items;
  return items.filter(item => matchesSelectedCenter(item.center_id as string | undefined, selectedCenterId));
};

export const filterReviewsBySelectedDate = (
  items: Array<Record<string, unknown>>,
  selectedDate: string,
) => items.filter(item => isReviewInSelectedDate(item, selectedDate));

const formatReviewCreatedTime = (
  item: Record<string, unknown>,
  selectedDate?: string,
): string | undefined => {
  const createdAtValue = getFeedbackCreatedAtValue(item);
  if (selectedDate && getFeedbackLocalDateKey(createdAtValue) === selectedDate) {
    return formatFeedbackLocalTime(createdAtValue);
  }
  return formatRelativeFeedbackTime(createdAtValue);
};

/**
 * نرمال‌سازی یک آیتم خام feedback (از ravi) به مدل نمایش نظر.
 * مشترک بین فید (بی‌پاسخ‌ها) و لیست صفحه‌بندی‌شده‌ی «همه».
 */
export const mapRawReviewToFeed = (
  item: Record<string, unknown>,
  slug?: string,
  options?: { selectedDate?: string },
): DoctorHomeFeedReview => {
  const rateRaw = item.avg_rate_value ?? item.avgRateValue ?? item.rate ?? item.avg_rate ?? null;
  const rateNum = rateRaw != null && rateRaw !== '' ? Number(rateRaw) : null;

  const nameRaw =
    item.user_display_name ??
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
    relativeCreatedTime: formatReviewCreatedTime(item, options?.selectedDate),
    userId: (item.user_id ?? item.userId) as string | number | undefined,
    // Public patient label: first name only (user_display_name is often full name).
    userName: toPatientFirstName(typeof nameRaw === 'string' ? nameRaw : null),
    rate: rateNum != null && Number.isFinite(rateNum) ? rateNum : null,
    centerName: typeof centerName === 'string' && centerName.trim() ? centerName.trim() : undefined,
    visited: item.visit_status === 'visited',
    likeCount: likeNum != null && Number.isFinite(likeNum) ? likeNum : undefined,
    doctorSlug: (item.doctor_slug ?? slug) as string | undefined,
  };
};
