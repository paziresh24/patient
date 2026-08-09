import { highlightText } from '../utils/highlightText';
import { useReviewerInfo } from '../composables/useReviewerInfo';

interface RaviReviewReplyProps {
  description: string;
  userId?: string;
  doctorUserId?: string;
  highlightQuery?: string;
}

const avatarUrl = (userId: string) => `https://pic.paziresh24.com/api/image/${userId}`;

export const RaviReviewReply = ({
  description,
  userId,
  doctorUserId,
  highlightQuery = '',
}: RaviReviewReplyProps) => {
  const isDoctor = Boolean(userId && doctorUserId && String(userId) === String(doctorUserId));
  const { data: reviewerInfo, isLoading } = useReviewerInfo(userId);

  const displayName = (() => {
    if (isLoading) return '...';
    const fullName = [reviewerInfo?.name, reviewerInfo?.family].filter(Boolean).join(' ');
    return fullName || 'کاربر بدون نام';
  })();

  return (
    <div className="mt-3 rounded-lg bg-slate-50 p-3" dir="rtl">
      <div className="flex items-center gap-2">
        {userId ? (
          <img
            src={avatarUrl(userId)}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}
        <span className="text-sm font-semibold text-slate-900">{displayName}</span>
        {isDoctor ? (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">پزشک</span>
        ) : null}
      </div>
      <p className="mt-2 text-justify text-sm font-medium leading-7 text-slate-700">
        {highlightText(description, highlightQuery)}
      </p>
    </div>
  );
};
