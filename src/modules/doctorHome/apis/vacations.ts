import { paziresh24AppClient } from '@/common/apis/client';
import { useQueries } from '@tanstack/react-query';
import moment from 'jalali-moment';
import { useEffect, useMemo, useRef, useState } from 'react';

interface VacationRaw {
  from?: number | string;
  to?: number | string;
  start?: number | string;
  end?: number | string;
  [key: string]: unknown;
}

interface Vacation {
  from: number;
  to: number;
}

interface FetchRange {
  key: string;
  from: number;
  to: number;
}

const makeRange = (start: moment.Moment, end: moment.Moment): FetchRange => ({
  key: `${start.format('YYYY-MM')}_${end.format('YYYY-MM')}`,
  from: start.startOf('day').unix(),
  to: end.endOf('day').unix(),
});

const initialRange = (selectedDate: string): FetchRange => {
  const d = moment(selectedDate, 'YYYY-MM-DD');
  return makeRange(d.clone().subtract(3, 'months'), d.clone().add(3, 'months'));
};

const getVacations = async (centerId: string, from: number, to: number): Promise<Vacation[]> => {
  const { data } = await paziresh24AppClient.get(`/V1/doctor/vacation/${centerId}`, {
    params: { from, to },
  });
  const items: VacationRaw[] = Array.isArray(data) ? data : (data?.data ?? []);
  return items
    .map(v => ({ from: Number(v.from ?? v.start ?? 0), to: Number(v.to ?? v.end ?? 0) }))
    .filter(v => v.from > 0 && v.to > 0);
};

export const useFullDayVacationSet = (centerIds: string[], selectedDate: string) => {
  const [ranges, setRanges] = useState<FetchRange[]>(() => [initialRange(selectedDate)]);
  const initialDateRef = useRef(selectedDate);

  // Reset ranges if the base date changes significantly (e.g. "go to today" button)
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

  const queries = useMemo(
    () =>
      centerIds.flatMap(id =>
        ranges.map(range => ({
          queryKey: ['vacations', id, range.key],
          queryFn: () => getVacations(id, range.from, range.to),
          staleTime: 10 * 60 * 1000,
          enabled: !!id,
        })),
      ),
    [centerIds, ranges],
  );

  const results = useQueries({ queries });

  return useMemo(() => {
    const allVacations = results.flatMap(r => r.data ?? []);
    const set = new Set<string>();
    if (allVacations.length === 0) return set;

    const covStart = moment.unix(Math.min(...ranges.map(r => r.from)));
    for (let i = 0; i < ranges.reduce((s, r) => s + Math.ceil((r.to - r.from) / 86400), 0); i++) {
      const day = covStart.clone().add(i, 'days');
      const dayStart = day.clone().startOf('day').unix();
      const dayEnd = day.clone().endOf('day').unix();
      // Use overlap threshold instead of exact boundary match — handles UTC offset (Iran = UTC+3:30)
      // and APIs that store vacations relative to work hours rather than calendar midnight.
      const isFullDay = allVacations.some(v => {
        const overlap = Math.min(v.to, dayEnd) - Math.max(v.from, dayStart);
        return overlap >= 12 * 3600;
      });
      if (isFullDay) set.add(day.format('YYYY-MM-DD'));
    }
    return set;
  }, [results, ranges]);
};
