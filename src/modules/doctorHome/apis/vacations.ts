import { paziresh24AppClient } from '@/common/apis/client';
import { useQueries } from '@tanstack/react-query';
import moment from 'jalali-moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { matchesSelectedCenter } from '../utils/centers';
import type { VacationCenterTarget } from '../utils/centers';

interface VacationRaw {
  from?: number | string;
  to?: number | string;
  start?: number | string;
  end?: number | string;
  [key: string]: unknown;
}

export interface DoctorVacation {
  from: number;
  to: number;
  centerId: string;
}

export interface VacationDayDisplay {
  description: string;
  additional_description?: string;
}

interface FetchRange {
  key: string;
  from: number;
  to: number;
}

const FULL_DAY_SECONDS = 12 * 3600;

const makeRange = (start: moment.Moment, end: moment.Moment): FetchRange => ({
  key: `${start.format('YYYY-MM')}_${end.format('YYYY-MM')}`,
  from: start.startOf('day').unix(),
  to: end.endOf('day').unix(),
});

const initialRange = (selectedDate: string): FetchRange => {
  const d = moment(selectedDate, 'YYYY-MM-DD');
  return makeRange(d.clone().subtract(3, 'months'), d.clone().add(3, 'months'));
};

const getVacations = async (
  apiId: string,
  centerId: string,
  from: number,
  to: number,
): Promise<DoctorVacation[]> => {
  const { data } = await paziresh24AppClient.get(`/V1/doctor/vacation/${apiId}`, {
    params: { from, to },
  });
  const items: VacationRaw[] = Array.isArray(data) ? data : (data?.data ?? []);
  return items
    .map(v => ({
      from: Number(v.from ?? v.start ?? 0),
      to: Number(v.to ?? v.end ?? 0),
      centerId,
    }))
    .filter(v => v.from > 0 && v.to > 0);
};

const dedupeVacations = (items: DoctorVacation[]): DoctorVacation[] => {
  const seen = new Set<string>();
  return items.filter(v => {
    const key = `${v.centerId}-${v.from}-${v.to}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getDayBounds = (date: string) => {
  const day = moment(date, 'YYYY-MM-DD');
  return {
    dayStart: day.clone().startOf('day').unix(),
    dayEnd: day.clone().endOf('day').unix(),
  };
};

const getOverlapSeconds = (vacation: DoctorVacation, dayStart: number, dayEnd: number) =>
  Math.min(vacation.to, dayEnd) - Math.max(vacation.from, dayStart);

export const getVacationsOnDate = (
  vacations: DoctorVacation[],
  date: string,
  options?: {
    selectedCenterId?: string | null;
    getCenterName?: (centerId: string) => string;
  },
): VacationDayDisplay[] => {
  const { selectedCenterId, getCenterName } = options ?? {};
  const scoped = selectedCenterId
    ? vacations.filter(v => matchesSelectedCenter(v.centerId, selectedCenterId))
    : vacations;
  const { dayStart, dayEnd } = getDayBounds(date);

  type SlotEntry = {
    overlapStart: number;
    timeLabel: string;
    centerIds: Set<string>;
  };

  const slotMap = new Map<string, SlotEntry>();

  for (const v of scoped) {
    if (getOverlapSeconds(v, dayStart, dayEnd) <= 0) continue;

    const overlapStart = Math.max(v.from, dayStart);
    const overlapEnd = Math.min(v.to, dayEnd);
    const duration = overlapEnd - overlapStart;
    const isFullDay = duration >= FULL_DAY_SECONDS;
    const timeLabel = isFullDay
      ? 'تمام‌روز'
      : `${moment.unix(overlapStart).format('HH:mm')} تا ${moment.unix(overlapEnd).format('HH:mm')}`;

    const slotKey = selectedCenterId ? `${v.centerId}-${overlapStart}-${overlapEnd}` : timeLabel;
    const existing = slotMap.get(slotKey);

    if (existing) {
      existing.centerIds.add(v.centerId);
      existing.overlapStart = Math.min(existing.overlapStart, overlapStart);
    } else {
      slotMap.set(slotKey, {
        overlapStart,
        timeLabel,
        centerIds: new Set([v.centerId]),
      });
    }
  }

  return Array.from(slotMap.values())
    .map(slot => {
      const centerNames = Array.from(slot.centerIds)
        .map(id => getCenterName?.(id) ?? 'مرکز')
        .filter(Boolean);

      const centerLabel = !selectedCenterId && centerNames.length > 0
        ? centerNames.join('، ')
        : undefined;

      const additional_description = centerLabel
        ? `${centerLabel} • ${slot.timeLabel}`
        : slot.timeLabel;

      return {
        description: 'مرخصی',
        additional_description,
        sortKey: slot.overlapStart,
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ description, additional_description }) => ({ description, additional_description }));
};

const buildVacationDaySets = (vacations: DoctorVacation[], ranges: FetchRange[]) => {
  const fullDaySet = new Set<string>();
  const anyDaySet = new Set<string>();

  if (vacations.length === 0 || ranges.length === 0) {
    return { fullDaySet, anyDaySet };
  }

  const covStart = moment.unix(Math.min(...ranges.map(r => r.from)));
  const totalDays = ranges.reduce((sum, r) => sum + Math.ceil((r.to - r.from) / 86400), 0);

  for (let i = 0; i < totalDays; i++) {
    const day = covStart.clone().add(i, 'days');
    const isoDate = day.format('YYYY-MM-DD');
    const { dayStart, dayEnd } = getDayBounds(isoDate);

    let maxOverlap = 0;
    for (const vacation of vacations) {
      const overlap = getOverlapSeconds(vacation, dayStart, dayEnd);
      if (overlap > maxOverlap) maxOverlap = overlap;
    }

    if (maxOverlap > 0) anyDaySet.add(isoDate);
    if (maxOverlap >= FULL_DAY_SECONDS) fullDaySet.add(isoDate);
  }

  return { fullDaySet, anyDaySet };
};

const useVacationRanges = (selectedDate: string) => {
  const [ranges, setRanges] = useState<FetchRange[]>(() => [initialRange(selectedDate)]);
  const initialDateRef = useRef(selectedDate);

  useEffect(() => {
    const prev = moment(initialDateRef.current, 'YYYY-MM-DD');
    const curr = moment(selectedDate, 'YYYY-MM-DD');
    if (Math.abs(curr.diff(prev, 'days')) > 90) {
      initialDateRef.current = selectedDate;
      setRanges([initialRange(selectedDate)]);
      return;
    }

    setRanges(prev => {
      const d = moment(selectedDate, 'YYYY-MM-DD');
      const covStart = moment.unix(Math.min(...prev.map(r => r.from)));
      const covEnd = moment.unix(Math.max(...prev.map(r => r.to)));
      const daysToEnd = covEnd.diff(d, 'days');
      const daysFromStart = d.diff(covStart, 'days');
      let updated = prev;

      if (daysToEnd <= 10) {
        const nextStart = covEnd.clone().add(1, 'day').startOf('day');
        const nextEnd = nextStart.clone().add(3, 'months').endOf('month');
        const r = makeRange(nextStart, nextEnd);
        if (!updated.find(x => x.key === r.key)) updated = [...updated, r];
      }

      if (daysFromStart <= 10) {
        const prevEnd = covStart.clone().subtract(1, 'day').endOf('day');
        const prevStart = prevEnd.clone().subtract(3, 'months').startOf('month');
        const r = makeRange(prevStart, prevEnd);
        if (!updated.find(x => x.key === r.key)) updated = [...updated, r];
      }

      return updated;
    });
  }, [selectedDate]);

  return ranges;
};

const scopeVacations = (vacations: DoctorVacation[], selectedCenterId?: string | null) =>
  selectedCenterId ? vacations.filter(v => matchesSelectedCenter(v.centerId, selectedCenterId)) : vacations;

export const useDoctorVacations = (
  centerTargets: VacationCenterTarget[],
  selectedDate: string,
  selectedCenterId?: string | null,
) => {
  const ranges = useVacationRanges(selectedDate);

  const queries = useMemo(
    () =>
      centerTargets.flatMap(({ centerId, apiId }) =>
        ranges.map(range => ({
          queryKey: ['vacations', apiId, centerId, range.key],
          queryFn: () => getVacations(apiId, centerId, range.from, range.to),
          staleTime: 10 * 60 * 1000,
          enabled: !!apiId && !!centerId,
        })),
      ),
    [centerTargets, ranges],
  );

  const results = useQueries({ queries });

  return useMemo(() => {
    const vacations = dedupeVacations(results.flatMap(r => r.data ?? []));
    const scoped = scopeVacations(vacations, selectedCenterId);
    const { fullDaySet, anyDaySet } = buildVacationDaySets(scoped, ranges);
    return { vacations: scoped, fullDaySet, anyDaySet };
  }, [results, ranges, selectedCenterId]);
};

export const useFullDayVacationSet = (
  centerTargets: VacationCenterTarget[],
  selectedDate: string,
  selectedCenterId?: string | null,
) => useDoctorVacations(centerTargets, selectedDate, selectedCenterId).fullDaySet;

export const useVacationDaySet = (
  centerTargets: VacationCenterTarget[],
  selectedDate: string,
  selectedCenterId?: string | null,
) => useDoctorVacations(centerTargets, selectedDate, selectedCenterId).anyDaySet;
