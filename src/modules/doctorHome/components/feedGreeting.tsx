import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useMemo, useRef } from 'react';
import { DsDateStrip, ds } from '../designSystem';
import type { DsDateStripRef } from '../designSystem';
import { HOLIDAY_YEAR_END, HOLIDAY_YEAR_START, useHolidays } from '../apis/holidays';
import { getVacationsOnDate, useDoctorVacations } from '../apis/vacations';
import { DoctorHomeFeedStats } from '../types/feed';
import { CenterStrip } from './centerStrip';
import { FeedInsightSection } from './feedInsightSection';
import { useSelectedDateStore } from '../store/selectedDate';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { getDoctorCenterOptions, getVacationCenterTargets } from '../utils/centers';
import { useSheetRoute } from '../hooks/useSheetRoute';
import { TodayIcon } from './icons';

interface FeedGreetingProps {
  stats?: DoctorHomeFeedStats;
  notificationDateSet?: Set<string>;
  className?: string;
  /** دسکتاپ: نوار تاریخ مخفی — تقویم ماهانه جایگزین می‌شود */
  hideDateStrip?: boolean;
  /** دسکتاپ: شاخص‌ها در ستون جدا رندر می‌شوند */
  hideStats?: boolean;
  /** دسکتاپ میزکار: فاصله‌های فشرده‌تر */
  workstationLayout?: boolean;
}

export const FeedGreeting = ({
  stats,
  notificationDateSet,
  className,
  hideDateStrip = false,
  hideStats = false,
  workstationLayout = false,
}: FeedGreetingProps) => {
  const stripRef = useRef<DsDateStripRef>(null);
  const user = useUserInfoStore(state => state.info);
  const selectedDate = useSelectedDateStore(s => s.selectedDate);
  const selectedCenterId = useSelectedCenterStore(s => s.selectedCenterId);
  const selectedMoment = moment(selectedDate, 'YYYY-MM-DD');
  const isToday = selectedMoment.isSame(moment(), 'day');
  const todayOnRight = selectedMoment.isAfter(moment(), 'day');
  const { data: holidays } = useHolidays(HOLIDAY_YEAR_START, HOLIDAY_YEAR_END);
  const vacationCenterTargets = useMemo(() => getVacationCenterTargets(user ?? undefined), [user]);
  const centerNameById = useMemo(() => {
    const map = new Map<string, string>();
    getDoctorCenterOptions(user).forEach(option => {
      if (option.id) map.set(option.id, option.name);
    });
    return map;
  }, [user]);
  const { vacations } = useDoctorVacations(vacationCenterTargets, selectedDate, selectedCenterId);
  const selectedDayHoliday = (holidays ?? []).find(h => h.date === selectedDate);
  const holidayEvents = selectedDayHoliday?.events ?? [];
  const allEvents = holidayEvents.filter(e => e.is_holiday);
  const vacationEvents = useMemo(
    () =>
      getVacationsOnDate(vacations, selectedDate, {
        selectedCenterId,
        getCenterName: id => centerNameById.get(id) ?? 'مرکز',
      }),
    [vacations, selectedDate, selectedCenterId, centerNameById],
  );
  const vacationSheet = useSheetRoute('vacation');

  const holidayBanners =
    allEvents.length > 0 || vacationEvents.length > 0 ? (
      <div className="flex flex-col gap-1.5">
        {allEvents.map((event, i) => (
          <div
            key={`holiday-${i}`}
            className={classNames(
              'flex items-start gap-2 rounded-xl px-3 py-2',
              event.is_holiday ? ds.surface.holidaySoft : ds.surface.neutralSoft,
            )}
          >
            <span
              className={classNames(
                'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                event.is_holiday ? 'bg-red-400' : 'bg-slate-400',
              )}
            />
            <div className="flex flex-col gap-0.5">
              <span className={event.is_holiday ? ds.type.alert : ds.type.label}>{event.description}</span>
              {event.additional_description && (
                <span className={ds.type.captionMuted}>{event.additional_description}</span>
              )}
            </div>
          </div>
        ))}
        {vacationEvents.map((event, i) => (
          <button
            key={`vacation-${i}`}
            type="button"
            onClick={() => vacationSheet.openSheet()}
            className={classNames(
              'flex w-full items-start gap-2 rounded-xl px-3 py-2 text-right',
              ds.motion.listRow,
              'hover:bg-red-100/80 active:bg-red-100',
              ds.surface.holidaySoft,
            )}
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            <div className="flex flex-col gap-0.5">
              <span className={ds.type.alert}>{event.description}</span>
              {event.additional_description && (
                <span className={ds.type.captionMuted}>{event.additional_description}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    ) : null;

  const dateStripBlock = (
    <div className="relative">
      <DsDateStrip ref={stripRef} markedDates={notificationDateSet} />
      {!isToday && (
        <button
          type="button"
          onClick={() => stripRef.current?.goToToday()}
          className={classNames(
            'absolute top-1/2 z-30 -translate-y-1/2 flex items-center gap-1 rounded-full px-2.5 py-1 whitespace-nowrap',
            ds.surface.primarySoft,
            ds.type.label,
            'text-primary',
            todayOnRight ? 'right-0' : 'left-0',
          )}
        >
          <TodayIcon
            size="xs"
            className={classNames('shrink-0', todayOnRight && 'scale-x-[-1]')}
          />
          امروز
        </button>
      )}
    </div>
  );

  if (workstationLayout && hideDateStrip && hideStats && !holidayBanners) return null;

  return (
    <header className={classNames(workstationLayout ? 'space-y-3' : hideDateStrip ? 'space-y-4' : ds.layout.headerStack, className)}>
      {!hideDateStrip && (
        <>
          {dateStripBlock}
          <CenterStrip />
          {holidayBanners}
        </>
      )}

      {!hideStats && (
        <FeedInsightSection
          stats={stats}
          variant={hideDateStrip ? 'grid' : 'responsive'}
        />
      )}

      {hideDateStrip && !workstationLayout && (
        <>
          <CenterStrip className="px-1" />
          {holidayBanners}
        </>
      )}

      {hideDateStrip && workstationLayout && holidayBanners}
    </header>
  );
};
