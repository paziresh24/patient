import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { StatCard } from './statCard';

interface StatsRowProps {
  performanceScore: number | null;
  isPerformanceLoading: boolean;
  satisfactionRating: number | null;
  satisfactionReviewCount: number | null;
  isSatisfactionLoading: boolean;
  todayAppointmentsCount: number | null;
  isTodayCountLoading: boolean;
  pageViewCount: number | null;
  isPageViewLoading: boolean;
  slug?: string;
}

export const StatsRow = ({
  performanceScore,
  isPerformanceLoading,
  satisfactionRating,
  satisfactionReviewCount,
  isSatisfactionLoading,
  todayAppointmentsCount,
  isTodayCountLoading,
  pageViewCount,
  isPageViewLoading,
  slug,
}: StatsRowProps) => {
  const userId = useUserInfoStore(state => state.info?.id);

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
      <StatCard
        label="امتیاز عملکرد"
        value={performanceScore != null ? `${performanceScore} از ۱۰۰` : null}
        isLoading={isPerformanceLoading}
        href="/dashboard/apps/sanje/my-performance/"
        onClick={() => sendDoctorHomeEvent(userId, 'stat_performance', { score: performanceScore })}
      />
      <StatCard
        label="رضایت مراجعین"
        value={satisfactionRating != null ? `${satisfactionRating} از ۵` : null}
        subtitle={
          satisfactionReviewCount != null
            ? `${satisfactionReviewCount.toLocaleString('fa-IR')} نظر`
            : undefined
        }
        isLoading={isSatisfactionLoading}
        href="/dashboard/reviews"
        onClick={() =>
          sendDoctorHomeEvent(userId, 'stat_satisfaction', {
            rating: satisfactionRating,
            review_count: satisfactionReviewCount,
          })
        }
      />
      <StatCard
        label="نوبت‌های امروز"
        value={todayAppointmentsCount}
        isLoading={isTodayCountLoading}
        href="/dashboard/apps/drapp/appointments/"
        onClick={() => sendDoctorHomeEvent(userId, 'stat_appointments', { count: todayAppointmentsCount })}
      />
      <StatCard
        label="بازدید صفحه"
        value={pageViewCount != null ? convertLongToCompactNumber(pageViewCount) : null}
        isLoading={isPageViewLoading}
        href={slug ? `/dr/${slug}` : undefined}
        onClick={() => sendDoctorHomeEvent(userId, 'stat_page_view', { count: pageViewCount })}
      />
    </div>
  );
};
