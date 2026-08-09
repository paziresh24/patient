import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useQuery } from '@tanstack/react-query';
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

  const summaryQuery = useQuery(['ravi-rate-summary', doctorSlug], () => fetchRateSummary(doctorSlug), {
    enabled: !!doctorSlug,
    staleTime: 60_000,
  });
  const hideRates = summaryQuery.data?.hideRates;

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
