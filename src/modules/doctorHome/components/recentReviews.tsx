import Skeleton from '@/common/components/atom/skeleton';
import {
  enrichReviewResponseWithRelativeTime,
  getFeedbackCreatedAtValue,
} from '@/common/utils/formatRelativeFeedbackTime';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useMemo } from 'react';
import { ds } from '../designSystem/tokens';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { SectionCard } from './sectionCard';
import { SectionHeader } from './sectionHeader';

interface ReviewItem {
  id?: string | number;
  description?: string;
  recommended?: string | number | boolean;
  [key: string]: unknown;
}

interface RecentReviewsProps {
  items: ReviewItem[];
  isLoading: boolean;
  slug?: string;
  className?: string;
}

const ReviewRow = ({ item }: { item: ReviewItem & { relativeCreatedTime?: string } }) => {
  const description = removeHtmlTagInString(String(item.description ?? '')).trim();
  const isRecommended = item.recommended === '1' || item.recommended === 1 || item.recommended === true;

  return (
    <div className={classNames('border-b border-slate-100 py-2.5 last:border-0')}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className={ds.type.captionSm}>{item.relativeCreatedTime ?? ''}</span>
        {item.recommended != null && (
          <span className={classNames(ds.type.captionSm, isRecommended ? ds.type.success : ds.type.danger)}>
            {isRecommended ? 'توصیه می‌کند' : 'توصیه نمی‌کند'}
          </span>
        )}
      </div>
      <p className={classNames(ds.type.body, 'line-clamp-2')}>{description || 'بدون متن'}</p>
    </div>
  );
};

export const RecentReviews = ({ items, isLoading, slug, className }: RecentReviewsProps) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const enrichedItems = useMemo(
    () =>
      enrichReviewResponseWithRelativeTime(
        items.map(item => ({
          ...item,
          created_at: getFeedbackCreatedAtValue(item),
        })),
      ),
    [items],
  );

  const reviewsHref = slug ? `/dashboard/reviews` : undefined;

  return (
    <SectionCard className={className}>
      <SectionHeader
        title="آخرین نظرات"
        href={reviewsHref}
        onSeeAllClick={() => sendDoctorHomeEvent(userId, 'reviews_see_all')}
      />

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <Skeleton key={i} h="4rem" w="100%" rounded="lg" />
          ))}
        </div>
      )}

      {!isLoading && enrichedItems.length === 0 && (
        <p className={classNames(ds.type.emptyState, 'py-4 text-center')}>هنوز نظری ثبت نشده است.</p>
      )}

      {!isLoading && enrichedItems.length > 0 && (
        <div>
          {enrichedItems.map((item, index) => (
            <ReviewRow key={String(item.id ?? index)} item={item} />
          ))}
        </div>
      )}
    </SectionCard>
  );
};
