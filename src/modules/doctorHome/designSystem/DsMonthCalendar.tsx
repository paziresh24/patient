import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useEffect, useMemo, useState } from 'react';
import { HOLIDAY_YEAR_END, HOLIDAY_YEAR_START, useHolidays } from '../apis/holidays';
import { useDoctorVacations } from '../apis/vacations';
import { useSelectedDateStore } from '../store/selectedDate';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { getVacationCenterTargets } from '../utils/centers';
import { dsFocusRing } from '../utils/a11y';
import { ds } from './tokens';

const WEEKDAY_LABELS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const getMonthCells = (viewMonth: moment.Moment) => {
  const monthStart = viewMonth.clone().startOf('jMonth');
  const daysInMonth = viewMonth.jDaysInMonth();
  const offset = (monthStart.day() + 1) % 7;
  const cells: Array<moment.Moment | null> = [];

  for (let i = 0; i < offset; i++) cells.push(null);
  for (let day = 0; day < daysInMonth; day++) {
    cells.push(monthStart.clone().add(day, 'days'));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

export const DsMonthCalendar = ({
  markedDates,
  className,
}: {
  markedDates?: Set<string>;
  className?: string;
}) => {
  const today = moment();
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const setSelectedDate = useSelectedDateStore(state => state.setSelectedDate);
  const selectedCenterId = useSelectedCenterStore(state => state.selectedCenterId);
  const user = useUserInfoStore(state => state.info);
  const vacationCenterTargets = useMemo(() => getVacationCenterTargets(user ?? undefined), [user]);
  const [viewMonth, setViewMonth] = useState(() => moment(selectedDate, 'YYYY-MM-DD').startOf('jMonth'));

  const { data: holidays } = useHolidays(HOLIDAY_YEAR_START, HOLIDAY_YEAR_END);
  const holidaySet = useMemo(
    () => new Set((holidays ?? []).filter(h => h.is_holiday).map(h => h.date)),
    [holidays],
  );
  const { fullDaySet: vacationSet } = useDoctorVacations(vacationCenterTargets, selectedDate, selectedCenterId);

  useEffect(() => {
    const selected = moment(selectedDate, 'YYYY-MM-DD');
    setViewMonth(current => (selected.isSame(current, 'jMonth') ? current : selected.clone().startOf('jMonth')));
  }, [selectedDate]);

  const cells = useMemo(() => getMonthCells(viewMonth), [viewMonth]);
  const monthLabel = viewMonth.clone().locale('fa').format('jMMMM jYYYY');
  const isViewingTodayMonth = viewMonth.isSame(today, 'jMonth');

  return (
    <div className={classNames('select-none', className)} dir="rtl">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="ماه قبل"
          onClick={() => setViewMonth(m => m.clone().subtract(1, 'jMonth'))}
          className={classNames(
            'flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 hover:bg-slate-50',
            ds.motion.surface,
            ds.motion.press,
            dsFocusRing,
          )}
        >
          ‹
        </button>
        <p className={classNames(ds.type.section, 'flex-1 text-center')}>{monthLabel}</p>
        <button
          type="button"
          aria-label="ماه بعد"
          onClick={() => setViewMonth(m => m.clone().add(1, 'jMonth'))}
          className={classNames(
            'flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 hover:bg-slate-50',
            ds.motion.surface,
            ds.motion.press,
            dsFocusRing,
          )}
        >
          ›
        </button>
      </div>

      <div key={viewMonth.format('YYYY-MM')} className="grid grid-cols-7 gap-y-1 animate-doctor-fade-up motion-reduce:animate-none" role="grid" aria-label={`تقویم ${monthLabel}`}>
        {WEEKDAY_LABELS.map(label => (
          <div
            key={label}
            className={classNames(
              'flex h-8 items-center justify-center text-center text-[11px] font-medium',
              label === 'ج' ? 'text-red-400' : 'text-slate-400',
            )}
          >
            {label}
          </div>
        ))}

        {cells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} role="gridcell" aria-hidden className="flex h-9 items-center justify-center" />;
          }

          const isoDate = day.format('YYYY-MM-DD');
          const isSelected = isoDate === selectedDate;
          const isDayToday = day.isSame(today, 'day');
          const isFriday = day.day() === 5;
          const isHoliday = holidaySet.has(isoDate) || isFriday;
          const isVacation = vacationSet.has(isoDate);
          const hasNotification = markedDates?.has(isoDate) ?? false;
          const dayNum = day.clone().locale('fa').format('jD');

          return (
            <div key={isoDate} role="gridcell" className="flex h-9 items-center justify-center">
              <button
                type="button"
                aria-pressed={isSelected}
                aria-label={day.clone().locale('fa').format('dddd jD jMMMM')}
                onClick={() => setSelectedDate(isoDate)}
                className={classNames(
                  'relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium tabular-nums',
                  ds.motion.surface,
                  ds.motion.press,
                  dsFocusRing,
                  isSelected
                    ? classNames(
                        'scale-105 shadow-sm',
                        isHoliday ? 'bg-red-500 text-white' : 'bg-primary text-white',
                      )
                    : 'hover:scale-105 hover:bg-slate-100',
                  !isSelected && isHoliday && 'text-red-500',
                  !isSelected && isDayToday && !isHoliday && 'text-primary',
                  !isSelected && !isHoliday && !isDayToday && 'text-slate-700',
                )}
              >
                <span className={classNames(isVacation && !isSelected && 'line-through decoration-2')}>{dayNum}</span>
                {hasNotification && (
                  <span
                    className={classNames(
                      'absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                      isSelected ? 'bg-amber-200' : 'bg-primary',
                    )}
                    aria-hidden
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {!isViewingTodayMonth && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              const todayIso = today.format('YYYY-MM-DD');
              setSelectedDate(todayIso);
              setViewMonth(today.clone().startOf('jMonth'));
            }}
            className={ds.type.link}
          >
            برو به امروز
          </button>
        </div>
      )}
    </div>
  );
};
