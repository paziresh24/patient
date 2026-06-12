import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import {
  DsDateStrip,
  DsInsightCarousel,
  ds,
} from '../designSystem';
import type { DsDateStripRef } from '../designSystem';
import { HOLIDAY_YEAR_END, HOLIDAY_YEAR_START, useHolidays } from '../apis/holidays';
import { UpcomingAppointment } from '../apis/upcomingAppointments';
import { DoctorHomeFeedReview, DoctorHomeFeedStats } from '../types/feed';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { useSelectedDateStore } from '../store/selectedDate';
import { DsDrawer } from './DsDrawer';
import { AllAppointmentsDrawerContent, AppointmentDetailContent, PaginatedReviewsList, ReviewDetailContent } from './feedDrawerContents';
import { useSheetRoute } from '../hooks/useSheetRoute';

interface FeedGreetingProps {
  stats?: DoctorHomeFeedStats;
  appointments?: { items: UpcomingAppointment[]; todayCount: number | null };
  reviews?: { items: DoctorHomeFeedReview[]; slug?: string; doctorUserId?: string };
  className?: string;
}

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
      <span className="text-5xl font-bold tabular-nums text-slate-900">{value}</span>
    ) : (
      <span className="text-lg text-slate-400">در حال بارگذاری…</span>
    )}
    <div className="text-center">
      <p className="text-base font-semibold text-slate-800">{label}</p>
      <p className={classNames(ds.type.caption, 'mt-1')}>{description}</p>
    </div>
  </div>
);

export const FeedGreeting = ({ stats, appointments, reviews, className }: FeedGreetingProps) => {
  const stripRef = useRef<DsDateStripRef>(null);
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const selectedDate = useSelectedDateStore(s => s.selectedDate);
  const selectedMoment = moment(selectedDate, 'YYYY-MM-DD');
  const isToday = selectedMoment.isSame(moment(), 'day');
  const { data: holidays } = useHolidays(HOLIDAY_YEAR_START, HOLIDAY_YEAR_END);
  const selectedDayHoliday = (holidays ?? []).find(h => h.date === selectedDate);
  const holidayEvents = selectedDayHoliday?.events ?? [];
  const allEvents = holidayEvents.filter(e => e.is_holiday);
  const dateLabel = selectedMoment.clone().locale('fa').format('dddd، jD jMMMM');
  const appointmentDayLabel = isToday ? 'نوبت امروز' : `نوبت ${selectedMoment.clone().locale('fa').format('jD jMMMM')}`;
  const appointmentSubLabel = isToday ? 'مراجعین امروز' : `مراجعین ${selectedMoment.clone().locale('fa').format('dddd')}`;

  const router = useRouter();
  const apptSheet = useSheetRoute('stat-appointments');
  const detailSheet = useSheetRoute('stat-appointment-detail');
  const reviewsSheet = useSheetRoute('stat-reviews');
  const reviewDetailSheet = useSheetRoute('stat-review-detail');
  const performanceSheet = useSheetRoute('stat-performance');
  const pageViewSheet = useSheetRoute('stat-pageview');

  // نوبت انتخاب‌شده برای مودال جزئیات از URL خونده میشه
  const apptId = router.query['appt-id'];
  const apptIdStr = Array.isArray(apptId) ? apptId[0] : (apptId ?? '');
  const selectedAppointment = apptIdStr
    ? (appointments?.items.find(a => String(a.book_id) === apptIdStr) ?? null)
    : null;
  const lastApptRef = useRef<UpcomingAppointment | null>(null);
  if (detailSheet.open && selectedAppointment) {
    lastApptRef.current = selectedAppointment;
  }

  // نظر انتخاب‌شده برای مودال جزئیات نظر — از ref که آبجکت نظرها رو نگه می‌داره
  const reviewsByIdRef = useRef<Record<string, DoctorHomeFeedReview>>({});
  const selectReview = (review: DoctorHomeFeedReview) => {
    if (review.id == null) return;
    reviewsByIdRef.current[String(review.id)] = review;
    reviewDetailSheet.openSheet({ 'review-id': String(review.id) });
  };
  const reviewId = router.query['review-id'];
  const reviewIdStr = Array.isArray(reviewId) ? reviewId[0] : (reviewId ?? '');
  const selectedReview = reviewIdStr ? (reviewsByIdRef.current[reviewIdStr] ?? null) : null;
  const lastReviewRef = useRef<DoctorHomeFeedReview | null>(null);
  if (reviewDetailSheet.open && selectedReview) {
    lastReviewRef.current = selectedReview;
  }

  return (
    <header className={classNames('space-y-5', className)}>
      <div className="relative flex items-center justify-center">
        <p className={ds.type.display}>{dateLabel}</p>
        <div
          className={classNames(
            'absolute left-0 overflow-hidden transition-all duration-200',
            isToday ? 'w-0 opacity-0' : 'opacity-100',
          )}
        >
          <button
            type="button"
            onClick={() => stripRef.current?.goToToday()}
            className={classNames('flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap', ds.surface.primarySoft, 'text-primary')}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 shrink-0">
              <path d="M4 10h9a3 3 0 0 0 0-6H9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 7l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            امروز
          </button>
        </div>
      </div>

      <DsDateStrip ref={stripRef} />

      {allEvents.length > 0 && (
        <div className="flex flex-col gap-1">
          {allEvents.map((event, i) => (
            <div key={i} className={classNames('flex items-start gap-2 rounded-xl px-3 py-2', event.is_holiday ? 'bg-red-50' : 'bg-slate-50')}>
              <span className={classNames('mt-1 h-1.5 w-1.5 shrink-0 rounded-full', event.is_holiday ? 'bg-red-400' : 'bg-slate-400')} />
              <div className="flex flex-col gap-0.5">
                <span className={classNames('text-xs font-medium', event.is_holiday ? 'text-red-500' : 'text-slate-600')}>{event.description}</span>
                {event.additional_description && (
                  <span className="text-[11px] text-slate-400">{event.additional_description}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {stats && (
        <div>
          <h2 className={classNames(ds.type.section, 'mb-3')}>خلاصه عملکرد</h2>
          <DsInsightCarousel
            items={[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                  </svg>
                ),
                title: appointmentDayLabel,
                description: appointmentSubLabel,
                value: stats.todayAppointmentsCount != null ? stats.todayAppointmentsCount.toLocaleString('fa-IR') : null,
                tint: ds.surface.primaryTint,
                isLoading: stats.isTodayCountLoading && stats.todayAppointmentsCount == null,
                onPress: () => {
                  sendDoctorHomeEvent(userId, 'stat_appointments', { count: stats.todayAppointmentsCount });
                  apptSheet.openSheet();
                },
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" />
                  </svg>
                ),
                title: 'امتیاز شما',
                description: 'عملکرد در سنجه',
                value: stats.performanceScore ?? null,
                tint: ds.surface.primaryTint,
                isLoading: stats.isPerformanceLoading,
                onPress: () => {
                  sendDoctorHomeEvent(userId, 'stat_performance', { score: stats.performanceScore });
                  performanceSheet.openSheet();
                },
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-amber-500">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ),
                title: 'رضایت بیماران',
                description: stats.satisfactionReviewCount != null ? `${stats.satisfactionReviewCount} نظر` : 'میانگین امتیاز',
                value: stats.satisfactionRating ?? null,
                tint: 'bg-amber-50',
                isLoading: stats.isSatisfactionLoading,
                onPress: () => {
                  sendDoctorHomeEvent(userId, 'stat_satisfaction', { rating: stats.satisfactionRating, review_count: stats.satisfactionReviewCount });
                  reviewsSheet.openSheet();
                },
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
                title: 'بازدید صفحه',
                description: 'بازدید پروفایل',
                value: stats.pageViewCount != null ? convertLongToCompactNumber(stats.pageViewCount) : null,
                tint: ds.surface.secondarySoft,
                isLoading: stats.isPageViewLoading,
                onPress: () => {
                  sendDoctorHomeEvent(userId, 'stat_page_view', { count: stats.pageViewCount });
                  pageViewSheet.openSheet();
                },
              },
            ]}
          />
        </div>
      )}

      <DsDrawer
        open={apptSheet.open}
        onOpenChange={o => { if (!o) apptSheet.closeSheet(); }}
        title={appointments?.todayCount != null ? `برنامه امروز · ${appointments.todayCount.toLocaleString('fa-IR')} نوبت` : 'برنامه امروز'}
        description="لیست نوبت‌های امروز"
      >
        {appointments ? (
          <AllAppointmentsDrawerContent
            items={appointments.items}
            todayCount={appointments.todayCount}
            onSelectAppointment={id => detailSheet.openSheet({ 'appt-id': id })}
          />
        ) : (
          <div className="px-4 pb-8 pt-4">
            <p className={classNames(ds.type.caption, 'text-center')}>اطلاعات نوبت‌ها در حال بارگذاری است</p>
          </div>
        )}
      </DsDrawer>

      <DsDrawer
        open={detailSheet.open}
        onOpenChange={o => { if (!o) detailSheet.closeSheet(); }}
        title="جزئیات نوبت"
        description="اطلاعات بیمار و نوبت"
        level={1}
      >
        {(selectedAppointment ?? lastApptRef.current) && (
          <AppointmentDetailContent appointment={(selectedAppointment ?? lastApptRef.current)!} />
        )}
      </DsDrawer>

      <DsDrawer
        open={reviewsSheet.open}
        onOpenChange={o => { if (!o) reviewsSheet.closeSheet(); }}
        title="بازخورد بیماران"
        description="نظرات اخیر بیماران"
      >
        <PaginatedReviewsList slug={reviews?.slug} onSelectReview={selectReview} />
      </DsDrawer>

      <DsDrawer
        open={reviewDetailSheet.open}
        onOpenChange={o => { if (!o) reviewDetailSheet.closeSheet(); }}
        title="جزئیات نظر"
        description="نظر بیمار و پاسخ شما"
        level={1}
      >
        {(selectedReview ?? lastReviewRef.current) && (
          <ReviewDetailContent
            review={(selectedReview ?? lastReviewRef.current)!}
            slug={reviews?.slug}
            doctorUserId={reviews?.doctorUserId}
          />
        )}
      </DsDrawer>

      <DsDrawer
        open={performanceSheet.open}
        onOpenChange={o => { if (!o) performanceSheet.closeSheet(); }}
        description="عملکرد من در سنجه"
        fullHeight
        className="!p-0"
      >
        {performanceSheet.open && (
          <iframe
            src="https://jahannama.paziresh24.com/my-performance/?utm_source=p24portal&utm_medium=internal-link&utm_campaign=sanje-my-performance"
            title="عملکرد من در سنجه"
            className="h-full w-full border-0"
          />
        )}
      </DsDrawer>

      <DsDrawer
        open={pageViewSheet.open}
        onOpenChange={o => { if (!o) pageViewSheet.closeSheet(); }}
        title="بازدید پروفایل"
        description="آمار بازدید"
      >
        <MetricDrawerContent
          value={stats?.pageViewCount != null ? stats.pageViewCount.toLocaleString('fa-IR') : null}
          label="بازدید از پروفایل شما"
          description="تعداد کل بازدیدکنندگانی که صفحه پروفایل شما را مشاهده کرده‌اند"
        />
      </DsDrawer>
    </header>
  );
};
