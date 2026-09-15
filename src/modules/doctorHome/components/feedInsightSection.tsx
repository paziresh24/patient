import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect, useState } from 'react';
import { DsInsightCarousel, ds } from '../designSystem';
import { useDoctorWalletBalance } from '../apis/walletBalance';
import { useDoctorHomeStats } from '../hooks/useDoctorHomeStats';
import { useReviewWeekDelta } from '../hooks/useReviewWeekDelta';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { buildDoctorPanelUrl } from '../utils/iframeUrl';
import { DOCTOR_PANEL_URLS, RAVI_DOCSIDE_URL } from '../utils/doctorPanelUrls';
import { useWalletBalanceVisibilityStore } from '../store/walletBalanceVisibility';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { DsDrawer } from './DsDrawer';
import { useSheetDrawerProps } from '../hooks/doctorHomeSheetLayout';
import { useSheetRoute } from '../hooks/useSheetRoute';
import { FeedContentSwap } from './feedContentSwap';
import { PageViewIcon, ReviewsIcon, WalletIcon } from './icons';
import type { OriginRect } from '../utils/sharedElement';

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
  className,
  variant = 'responsive',
}: {
  className?: string;
  variant?: 'responsive' | 'grid' | 'stack' | 'carousel';
}) => {
  const user = useUserInfoStore(state => state.info);
  const { stats, isDoctor, slug } = useDoctorHomeStats(user);
  const { percent: reviewWeekDelta } = useReviewWeekDelta(slug, isDoctor);
  const userId = user?.id;
  const selectedCenterId = useSelectedCenterStore(s => s.selectedCenterId);
  const { data: walletBalance, isLoading: isWalletQueryLoading } = useDoctorWalletBalance(
    user,
    !!user?.id,
    selectedCenterId,
  );
  const isWalletVisible = useWalletBalanceVisibilityStore(state => state.isVisible);
  const isWalletHydrated = useWalletBalanceVisibilityStore(state => state.hydrated);
  const toggleWalletVisibility = useWalletBalanceVisibilityStore(state => state.toggle);
  const hydrateWalletVisibility = useWalletBalanceVisibilityStore(state => state.hydrate);
  const isWalletInitialLoading = !isWalletHydrated || isWalletQueryLoading;

  useEffect(() => {
    hydrateWalletVisibility();
  }, [hydrateWalletVisibility]);

  const reviewsSheet = useSheetRoute('stat-reviews');
  const walletSheet = useSheetRoute('stat-wallet');
  const pageViewSheet = useSheetRoute('stat-pageview');
  const reviewsDrawerProps = useSheetDrawerProps(reviewsSheet);
  const walletDrawerProps = useSheetDrawerProps(walletSheet);
  const pageViewDrawerProps = useSheetDrawerProps(pageViewSheet);
  const [sheetOrigin, setSheetOrigin] = useState<OriginRect | null>(null);

  const openWithOrigin = (origin: DOMRect | undefined, open: () => void) => {
    if (origin) {
      setSheetOrigin({ x: origin.left, y: origin.top, width: origin.width, height: origin.height });
    } else {
      setSheetOrigin(null);
    }
    open();
  };

  const insightItems = [
    {
      icon: <ReviewsIcon size="sm" />,
      title: 'نظرات بیماران',
      description:
        stats.satisfactionReviewCount != null
          ? `${stats.satisfactionReviewCount.toLocaleString('fa-IR')} نظر`
          : 'میانگین امتیاز',
      value: stats.satisfactionRating ?? null,
      tint: 'border border-amber-100/80 bg-gradient-to-br from-amber-50/90 to-white',
      valueClassName: 'text-amber-600',
      valueMax: 5,
      hideBar: true,
      trendPercent: reviewWeekDelta,
      isLoading: stats.isSatisfactionLoading,
      onPress: origin => {
        sendDoctorHomeEvent(userId, 'stat_satisfaction', {
          rating: stats.satisfactionRating,
          review_count: stats.satisfactionReviewCount,
        });
        openWithOrigin(origin, reviewsSheet.openSheet);
      },
    },
    {
      icon: <WalletIcon size="sm" />,
      title: 'کیف پول',
      description: 'تومان',
      value: isWalletHydrated
        ? walletBalance != null
          ? Math.trunc(walletBalance / 10).toLocaleString('fa-IR')
          : null
        : null,
      hiddenValue: '••••',
      tint: 'border border-primary/10 bg-gradient-to-br from-primary/[0.07] to-white',
      isLoading: isWalletInitialLoading,
      onPress: origin => {
        sendDoctorHomeEvent(userId, 'stat_wallet', { balance: walletBalance });
        openWithOrigin(origin, walletSheet.openSheet);
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
      tint: 'border border-slate-100 bg-gradient-to-br from-slate-50 to-white',
      valueClassName: 'text-slate-800',
      isLoading: stats.isPageViewLoading,
      onPress: origin => {
        sendDoctorHomeEvent(userId, 'stat_page_view', { count: stats.pageViewCount });
        openWithOrigin(origin, pageViewSheet.openSheet);
      },
    },
  ];

  const insightSwapKey = `${selectedCenterId ?? 'all'}-${stats.pageViewCount ?? ''}-${walletBalance ?? ''}-${reviewWeekDelta ?? ''}`;

  return (
    <>
      <FeedContentSwap swapKey={insightSwapKey} variant="fade">
        <DsInsightCarousel
          items={insightItems}
          variant={variant}
          appearance={variant === 'stack' ? 'workstation' : 'default'}
          compact={variant === 'responsive' || variant === 'carousel'}
          className={className}
        />
      </FeedContentSwap>

      <DsDrawer
        {...reviewsDrawerProps}
        originRect={reviewsSheet.open ? sheetOrigin : null}
        title="نظرات بیماران"
        description="راوی"
        fullHeight
        className="!p-0"
      >
        {reviewsSheet.open && (
          <iframe
            src={RAVI_DOCSIDE_URL}
            title="راوی؛ نظرات بیماران"
            className={classNames('min-h-0 w-full flex-1 border-0', ds.motion.contentFade)}
          />
        )}
      </DsDrawer>

      <DsDrawer
        {...walletDrawerProps}
        originRect={walletSheet.open ? sheetOrigin : null}
        title="کتیبه"
        description="مدیریت امور مالی"
        fullHeight
        className="!p-0"
      >
        {walletSheet.open && (
          <iframe
            key={`wallet-${selectedCenterId ?? 'all'}`}
            src={buildDoctorPanelUrl(DOCTOR_PANEL_URLS.bills, { userId, centerId: selectedCenterId })}
            title="کتیبه، مدیریت امور مالی"
            className={classNames('min-h-0 w-full flex-1 border-0', ds.motion.contentFade)}
          />
        )}
      </DsDrawer>

      <DsDrawer
        {...pageViewDrawerProps}
        originRect={pageViewSheet.open ? sheetOrigin : null}
        title="بازدید پروفایل"
        description="آمار بازدید"
      >
        <div className={ds.motion.contentFade}>
          <MetricDrawerContent
            value={stats.pageViewCount != null ? stats.pageViewCount.toLocaleString('fa-IR') : null}
            label="بازدید از پروفایل شما"
            description="تعداد کل بازدیدکنندگانی که صفحه پروفایل شما را مشاهده کرده‌اند"
          />
        </div>
      </DsDrawer>
    </>
  );
};
