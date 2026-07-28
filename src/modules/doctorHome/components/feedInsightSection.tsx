import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect } from 'react';
import { DsInsightCarousel, ds } from '../designSystem';
import { useDoctorWalletBalance } from '../apis/walletBalance';
import { DoctorHomeFeedStats } from '../types/feed';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { appendUserIdToUrl, buildDoctorPanelUrl } from '../utils/iframeUrl';
import { DOCTOR_PANEL_URLS, RAVI_DOCSIDE_URL } from '../utils/doctorPanelUrls';
import { useWalletBalanceVisibilityStore } from '../store/walletBalanceVisibility';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { DsDrawer } from './DsDrawer';
import { useSheetDrawerProps } from '../hooks/doctorHomeSheetLayout';
import { useSheetRoute } from '../hooks/useSheetRoute';
import { FeedContentSwap } from './feedContentSwap';
import { PageViewIcon, PerformanceIcon, ReviewsIcon, WalletIcon } from './icons';

const MetricDrawerContent = ({
  value,
  label,
  description,
}: {
  value: string | number | null;
  label: string;
  description: string;
}) => (
  <div className="flex flex-col items-center gap-4 px-4 pb-10 pt-6">
    {value != null ? (
      <span className={ds.type.hero}>{value}</span>
    ) : (
      <span className="text-lg text-slate-400">در حال بارگذاری…</span>
    )}
    <div className="text-center">
      <p className={ds.type.display}>{label}</p>
      <p className={classNames(ds.type.caption, 'mt-1')}>{description}</p>
    </div>
  </div>
);

export const FeedInsightSection = ({
  stats,
  className,
  variant = 'responsive',
}: {
  stats?: DoctorHomeFeedStats;
  className?: string;
  variant?: 'responsive' | 'grid' | 'stack' | 'carousel';
}) => {
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const selectedCenterId = useSelectedCenterStore(s => s.selectedCenterId);
  const { data: walletBalance, isLoading: isWalletLoading } = useDoctorWalletBalance(user, !!user?.id, selectedCenterId);
  const isWalletVisible = useWalletBalanceVisibilityStore(state => state.isVisible);
  const isWalletHydrated = useWalletBalanceVisibilityStore(state => state.hydrated);
  const toggleWalletVisibility = useWalletBalanceVisibilityStore(state => state.toggle);
  const hydrateWalletVisibility = useWalletBalanceVisibilityStore(state => state.hydrate);

  useEffect(() => {
    hydrateWalletVisibility();
  }, [hydrateWalletVisibility]);

  const reviewsSheet = useSheetRoute('stat-reviews');
  const walletSheet = useSheetRoute('stat-wallet');
  const performanceSheet = useSheetRoute('stat-performance');
  const pageViewSheet = useSheetRoute('stat-pageview');
  const reviewsDrawerProps = useSheetDrawerProps(reviewsSheet);
  const walletDrawerProps = useSheetDrawerProps(walletSheet);
  const performanceDrawerProps = useSheetDrawerProps(performanceSheet);
  const pageViewDrawerProps = useSheetDrawerProps(pageViewSheet);

  const insightItems = stats
    ? [
        {
          icon: <PerformanceIcon size="sm" />,
          title: 'امتیاز',
          description: 'عملکرد در پذیرش۲۴',
          value: stats.performanceScore ?? null,
          valueMax: 100,
          isLoading: stats.isPerformanceLoading,
          onPress: () => {
            sendDoctorHomeEvent(userId, 'stat_performance', { score: stats.performanceScore });
            performanceSheet.openSheet();
          },
        },
        {
          icon: <ReviewsIcon size="sm" />,
          title: 'نظرات بیماران',
          description: stats.satisfactionReviewCount != null ? `${stats.satisfactionReviewCount} نظر` : 'میانگین امتیاز',
          value: stats.satisfactionRating ?? null,
          valueMax: 5,
          valueBarClass: ds.progress.fillRating,
          isLoading: stats.isSatisfactionLoading,
          onPress: () => {
            sendDoctorHomeEvent(userId, 'stat_satisfaction', { rating: stats.satisfactionRating, review_count: stats.satisfactionReviewCount });
            reviewsSheet.openSheet();
          },
        },
        {
          icon: <WalletIcon size="sm" />,
          title: 'کیف پول',
          description: '',
          value: isWalletHydrated ? (walletBalance != null ? Math.round(walletBalance / 10).toLocaleString('fa-IR') : null) : null,
          hiddenValue: '••••••',
          isLoading: isWalletLoading || !isWalletHydrated,
          onPress: () => {
            sendDoctorHomeEvent(userId, 'stat_wallet', { balance: walletBalance });
            walletSheet.openSheet();
          },
          visibilityToggle: {
            isVisible: isWalletVisible,
            onToggle: toggleWalletVisibility,
          },
        },
        {
          icon: <PageViewIcon size="sm" />,
          title: 'بازدید صفحه',
          description: 'بازدیدکنندگان',
          value: stats.pageViewCount != null ? convertLongToCompactNumber(stats.pageViewCount) : null,
          isLoading: stats.isPageViewLoading,
          onPress: () => {
            sendDoctorHomeEvent(userId, 'stat_page_view', { count: stats.pageViewCount });
            pageViewSheet.openSheet();
          },
        },
      ]
    : [];

  if (insightItems.length === 0) return null;

  const insightSwapKey = `${selectedCenterId ?? 'all'}-${stats?.performanceScore ?? ''}-${stats?.pageViewCount ?? ''}-${walletBalance ?? ''}`;

  return (
    <>
      <FeedContentSwap swapKey={insightSwapKey} variant="fade">
        <DsInsightCarousel items={insightItems} variant={variant} className={className} />
      </FeedContentSwap>

      <DsDrawer {...reviewsDrawerProps} title="نظرات بیماران" description="راوی" fullHeight className="!p-0">
        {reviewsSheet.open && (
          <iframe
            src={appendUserIdToUrl(RAVI_DOCSIDE_URL, userId)}
            title="راوی؛ نظرات بیماران"
            className="min-h-0 w-full flex-1 border-0"
          />
        )}
      </DsDrawer>

      <DsDrawer {...walletDrawerProps} title="کتیبه" description="مدیریت امور مالی" fullHeight className="!p-0">
        {walletSheet.open && (
          <iframe
            key={`wallet-${selectedCenterId ?? 'all'}`}
            src={buildDoctorPanelUrl(DOCTOR_PANEL_URLS.bills, { userId, centerId: selectedCenterId })}
            title="کتیبه، مدیریت امور مالی"
            className="min-h-0 w-full flex-1 border-0"
          />
        )}
      </DsDrawer>

      <DsDrawer {...performanceDrawerProps} title="عملکرد من" description="سنجه" fullHeight className="!p-0">
        {performanceSheet.open && (
          <iframe
            src={appendUserIdToUrl(
              'https://jahannama.paziresh24.com/my-performance/?utm_source=p24portal&utm_medium=internal-link&utm_campaign=sanje-my-performance',
              userId,
            )}
            title="عملکرد من در سنجه"
            className="min-h-0 w-full flex-1 border-0"
          />
        )}
      </DsDrawer>

      <DsDrawer {...pageViewDrawerProps} title="بازدید پروفایل" description="آمار بازدید">
        <MetricDrawerContent
          value={stats?.pageViewCount != null ? stats.pageViewCount.toLocaleString('fa-IR') : null}
          label="بازدید از پروفایل شما"
          description="تعداد کل بازدیدکنندگانی که صفحه پروفایل شما را مشاهده کرده‌اند"
        />
      </DsDrawer>
    </>
  );
};
