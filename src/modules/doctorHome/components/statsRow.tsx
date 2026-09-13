import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import { useOpenDoctorPublicProfile } from '@/common/utils/doctorPublicProfile';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { ds } from '../designSystem/tokens';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { StatCard } from './statCard';

interface StatsRowProps {
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
  const { openPublicProfile } = useOpenDoctorPublicProfile();

  const handlePageViewClick = () => {
    sendDoctorHomeEvent(userId, 'stat_page_view', { count: pageViewCount });
    if (!slug) {
      void openPublicProfile();
    }
  };

  return (
    <div className={ds.layout.statsRowStrip}>
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
        onClick={handlePageViewClick}
      />
    </div>
  );
};
