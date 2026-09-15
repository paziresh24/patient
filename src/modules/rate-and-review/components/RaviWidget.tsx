import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { trackRaviReviewEvent } from '../analytics/trackRaviReviewEvent';
import { fetchRateSummary } from '../api';
import { RaviCenter } from '../types';
import { RaviList } from './RaviList';
import { RaviSummary } from './RaviSummary';

export interface RaviWidgetProps {
  doctorSlug: string;
  doctorUserId?: string;
  displayName?: string;
  centers?: RaviCenter[];
  hideSummary?: boolean;
}

export const RaviWidget = ({
  doctorSlug,
  doctorUserId,
  displayName,
  centers = [],
  hideSummary = false,
}: RaviWidgetProps) => {
  const userId = useUserInfoStore(state => state.info?.id?.toString());
  const viewedRef = useRef(false);
  const summaryTrackedRef = useRef<string | null>(null);
  const summaryQuery = useQuery(['ravi-rate-summary', doctorSlug], () => fetchRateSummary(doctorSlug), {
    enabled: !!doctorSlug,
    staleTime: 60_000,
  });
  const hideRates = summaryQuery.data?.hideRates;

  useEffect(() => {
    if (!doctorSlug || viewedRef.current) return;
    viewedRef.current = true;
    void trackRaviReviewEvent({
      event_type: 'review_section_view',
      slug: doctorSlug,
      doctor_id: doctorUserId,
      ok: true,
    });
  }, [doctorSlug, doctorUserId]);

  useEffect(() => {
    if (!doctorSlug || summaryQuery.isLoading) return;
    const key = `${doctorSlug}:${summaryQuery.isError ? 'err' : summaryQuery.data ? 'ok' : 'empty'}`;
    if (summaryTrackedRef.current === key) return;
    summaryTrackedRef.current = key;
    if (summaryQuery.isError) {
      void trackRaviReviewEvent({
        event_type: 'rate_summary_error',
        slug: doctorSlug,
        doctor_id: doctorUserId,
        ok: false,
        error_code: 'RATE_SUMMARY_ERROR',
      });
      return;
    }
    if (summaryQuery.data) {
      void trackRaviReviewEvent({
        event_type: 'rate_summary_load',
        slug: doctorSlug,
        doctor_id: doctorUserId,
        hide_rates: summaryQuery.data.hideRates,
        count: summaryQuery.data.count,
        ok: true,
      });
    }
  }, [doctorSlug, doctorUserId, summaryQuery.data, summaryQuery.isError, summaryQuery.isLoading]);

  if (!doctorSlug) {
    return <p className="text-sm text-slate-500">slug پزشک مشخص نشده است.</p>;
  }

  return (
    <div className="flex flex-col space-y-px" dir="rtl">
      {!hideSummary ? (
        summaryQuery.isLoading ? (
          <Skeleton w="100%" h="12rem" rounded="lg" />
        ) : summaryQuery.isError ? (
          <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            بارگذاری امتیاز و خلاصه نظرات با خطا مواجه شد.
          </p>
        ) : summaryQuery.data ? (
          <RaviSummary displayName={displayName} summary={summaryQuery.data} />
        ) : null
      ) : null}
      {!hideRates ? (
        <RaviList doctorSlug={doctorSlug} doctorUserId={doctorUserId} userId={userId} centers={centers} />
      ) : null}
    </div>
  );
};

export default RaviWidget;
