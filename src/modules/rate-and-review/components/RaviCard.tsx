import ShareIcon from '@/common/components/icons/share';
import { fetchShareCommentUrl } from '../api';
import { RaviReview } from '../types';
import { useReviewerName } from '../composables/useReviewerName';
import { highlightText } from '../utils/highlightText';
import { toFixedRating } from '../utils/rating';
import { RaviDoctorReplyPanel, RaviDoctorReplyToolbarButton, useRaviDoctorReply } from './RaviDoctorReplyForm';
import { RaviReviewOptions } from './RaviReviewOptions';
import { RaviUsefulRating } from './RaviUsefulRating';
import toast from 'react-hot-toast';

interface RaviCardProps {
  review: RaviReview;
  doctorSlug?: string;
  doctorUserId?: string;
  highlightQuery?: string;
  onDeleted?: () => void;
  onEdited?: (description: string) => void;
}

export const RaviCard = ({
  review,
  doctorSlug,
  doctorUserId,
  highlightQuery = '',
  onDeleted,
  onEdited,
}: RaviCardProps) => {
  const { data: fetchedName, isLoading: isNameLoading } = useReviewerName(review.userId);
  // Prefer /v1/users.name (first name). Never show family from user_display_name.
  const displayName = fetchedName ?? review.userName ?? (isNameLoading ? '...' : 'بیمار');
  const doctorReply = useRaviDoctorReply({
    feedbackId: review.id,
    doctorSlug,
    doctorUserId,
  });

  const share = async () => {
    if (typeof navigator === 'undefined' || !doctorSlug) return;
    try {
      const url = await fetchShareCommentUrl(doctorSlug, review.id);
      if (!url) {
        toast.error('دریافت لینک اشتراک‌گذاری ناموفق بود.');
        return;
      }
      const shareText = 'این نظر رو در پذیرش24 ببین 👇';
      if (navigator.share) {
        await navigator.share({ text: shareText, url }).catch(() => undefined);
        return;
      }
      await navigator.clipboard?.writeText(url);
      toast.success('لینک نظر کپی شد.');
    } catch {
      toast.error('اشتراک‌گذاری ناموفق بود.');
    }
  };

  return (
    <article className="w-full border-b border-slate-200 px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>

          <div className="min-w-0 flex-1 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900">
                {highlightText(displayName, highlightQuery)}
              </h4>
              {review.visited ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">ویزیت شده</span>
              ) : null}
            </div>
            {(review.dateLabel || review.centerName) ? (
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {review.dateLabel ? <span className="whitespace-nowrap">{review.dateLabel}</span> : null}
                {review.dateLabel && review.centerName ? <span>{' | '}</span> : null}
                {review.centerName ? (
                  <span className="inline-block min-w-0 text-right">{review.centerName}</span>
                ) : null}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-1">
          {review.rate != null ? (
            <div className="flex h-[35px] min-w-[35px] shrink-0 items-center justify-center rounded-md bg-blue-600 px-1.5 text-white">
              <span className="text-sm font-bold leading-none">{toFixedRating(review.rate)}</span>
            </div>
          ) : null}
          <RaviReviewOptions
            feedbackId={review.id}
            reviewUserId={review.userId}
            commentText={review.description}
            doctorSlug={doctorSlug}
            onDeleted={onDeleted}
            onEdited={onEdited}
          />
        </div>
      </div>

      <p className="mt-3 text-justify text-sm leading-7 text-slate-700">
        {highlightText(review.description, highlightQuery)}
      </p>

      <div className="mt-3 flex items-center justify-start gap-4 border-t border-slate-100 pt-3" dir="ltr">
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-0.5 text-sm leading-none text-slate-600"
        >
          <span>ارسال کن</span>
          <ShareIcon width={16} height={16} className="shrink-0" />
        </button>

        <RaviUsefulRating feedbackId={review.id} likeCount={review.likeCount} />

        <RaviDoctorReplyToolbarButton state={doctorReply} />
      </div>

      <RaviDoctorReplyPanel state={doctorReply} />
    </article>
  );
};
