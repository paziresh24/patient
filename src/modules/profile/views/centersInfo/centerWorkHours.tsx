import Button from '@/common/components/atom/button/button';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import CalenderIcon from '@/common/components/icons/calender';
import ChevronIcon from '@/common/components/icons/chevron';
import { apiGatewayClient } from '@/common/apis/client';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { useQuery } from '@tanstack/react-query';
import { memo, useEffect, useMemo, useState } from 'react';

type WorkSchedule = {
  day: string;
  from_date?: string | null;
  to_date?: string | null;
  from_hour: string;
  to_hour: string;
};

type CenterScheduleService = {
  id: string;
  title: string;
  schedules?: WorkSchedule[] | null;
};

type CenterSchedulesResponse = {
  center_id: string;
  services?: CenterScheduleService[] | null;
}[];

const WEEK_DAYS = [
  { english: 'saturday', persian: 'شنبه' },
  { english: 'sunday', persian: 'یک‌شنبه' },
  { english: 'monday', persian: 'دوشنبه' },
  { english: 'tuesday', persian: 'سه‌شنبه' },
  { english: 'wednesday', persian: 'چهارشنبه' },
  { english: 'thursday', persian: 'پنج‌شنبه' },
  { english: 'friday', persian: 'جمعه' },
] as const;

const DAY_NUMBER_TO_ENGLISH: Record<number, string> = {
  1: 'sunday',
  2: 'monday',
  3: 'tuesday',
  4: 'wednesday',
  5: 'thursday',
  6: 'friday',
  7: 'saturday',
};

const getScheduleType = () => {
  if (typeof window === 'undefined') return '1';
  return window.location.host.includes('.paziresh24.com') ? '7' : '1';
};

const isValidUserCenterId = (value?: string | number | null) => {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim();
  return Boolean(normalized) && normalized !== '-1' && normalized !== '0';
};

const fetchCenterSchedules = async (centerId: string, userCenterId: string) => {
  const { data } = await apiGatewayClient.get<CenterSchedulesResponse>('/v1/centeral-booking/schedules', {
    params: {
      center_id: centerId,
      user_center_id: userCenterId,
      type: getScheduleType(),
    },
  });

  return data;
};

const formatScheduleRange = (schedule: WorkSchedule) => {
  const datePrefix =
    schedule.from_date && schedule.to_date
      ? `(از تاریخ ${new Date(schedule.from_date).toLocaleDateString('fa-IR-u-nu-latn')} تا ${new Date(schedule.to_date).toLocaleDateString('fa-IR-u-nu-latn')}) `
      : '';

  return `${datePrefix}${schedule.from_hour.slice(0, 5)} - ${schedule.to_hour.slice(0, 5)}`;
};

const getSchedulesForDay = (schedules: WorkSchedule[] | null | undefined, day: string) => {
  if (!Array.isArray(schedules) || !schedules.length) return '---';

  const daySchedules = schedules.filter(schedule => schedule.day === day);
  if (!daySchedules.length) return '---';

  return daySchedules.map(formatScheduleRange).join(' | ');
};

const pickDefaultServiceId = (services: CenterScheduleService[]) => {
  const withSchedules = services.find(service => Array.isArray(service.schedules) && service.schedules.length > 0);
  return withSchedules?.id ?? services[0]?.id ?? null;
};

/** Convert SSR `hours_of_work` (day number + from/to) into API-like schedules. */
const mapHoursOfWorkToSchedules = (hoursOfWork: any[] | null | undefined): WorkSchedule[] => {
  if (!Array.isArray(hoursOfWork) || !hoursOfWork.length) return [];

  return hoursOfWork
    .map(hour => {
      const day = DAY_NUMBER_TO_ENGLISH[Number(hour?.day)];
      const from = hour?.from ?? hour?.from_hour;
      const to = hour?.to ?? hour?.to_hour;
      if (!day || !from || !to) return null;

      return {
        day,
        from_hour: String(from),
        to_hour: String(to),
        from_date: hour?.from_date ?? null,
        to_date: hour?.to_date ?? null,
      } satisfies WorkSchedule;
    })
    .filter(Boolean) as WorkSchedule[];
};

interface CenterWorkHoursProps {
  centerId: string;
  userCenterId?: string | null;
  centerName?: string;
  /** Optional SSR fallback services with hours_of_work */
  fallbackServices?: Array<{
    id?: string;
    title?: string;
    alias_title?: string;
    hours_of_work?: any[] | null;
  }>;
}

export const CenterWorkHours = memo(({ centerId, userCenterId, centerName, fallbackServices }: CenterWorkHoursProps) => {
  const { handleOpen, handleClose, modalProps } = useModal();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);

  const resolvedUserCenterId = isValidUserCenterId(userCenterId) ? String(userCenterId) : '';
  const isModalOpen = Boolean(modalProps.isOpen);

  const schedulesQuery = useQuery({
    queryKey: ['center-work-hours', centerId, resolvedUserCenterId],
    queryFn: () => fetchCenterSchedules(centerId, resolvedUserCenterId),
    enabled: Boolean(isModalOpen && centerId && resolvedUserCenterId),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const fallbackMappedServices = useMemo<CenterScheduleService[]>(() => {
    if (!fallbackServices?.length) return [];

    return fallbackServices
      .map((service, index) => {
        const schedules = mapHoursOfWorkToSchedules(service.hours_of_work);
        if (!schedules.length) return null;

        return {
          id: String(service.id ?? `fallback-${index}`),
          title: service.alias_title || service.title || 'خدمت',
          schedules,
        };
      })
      .filter(Boolean) as CenterScheduleService[];
  }, [fallbackServices]);

  const services = useMemo(() => {
    const fromApi = schedulesQuery.data?.[0]?.services ?? [];
    if (fromApi.length) return fromApi;
    if (schedulesQuery.isError || !resolvedUserCenterId) return fallbackMappedServices;
    if (!schedulesQuery.isFetching && schedulesQuery.isFetched) return fallbackMappedServices.length ? fallbackMappedServices : fromApi;
    return fromApi;
  }, [
    schedulesQuery.data,
    schedulesQuery.isError,
    schedulesQuery.isFetching,
    schedulesQuery.isFetched,
    fallbackMappedServices,
    resolvedUserCenterId,
  ]);

  const hasAnySchedules = useMemo(
    () => services.some(service => Array.isArray(service.schedules) && service.schedules.length > 0),
    [services],
  );

  useEffect(() => {
    if (!services.length) {
      setSelectedServiceId(null);
      return;
    }

    setSelectedServiceId(current => {
      if (current && services.some(service => service.id === current)) return current;
      return pickDefaultServiceId(services);
    });
  }, [services]);

  const selectedService = services.find(service => service.id === selectedServiceId) ?? services[0];

  if (!centerId) return null;

  return (
    <>
      <Button variant="secondary" icon={<CalenderIcon className="h-5 w-5" isSolid />} onClick={handleOpen}>
        برنامه کاری
      </Button>

      <Modal title={centerName ? `برنامه کاری در ${centerName}` : 'برنامه کاری'} {...modalProps} bodyClassName="space-y-4">
        {!resolvedUserCenterId && !fallbackMappedServices.length ? (
          <Text fontSize="sm" className="text-center text-slate-500">
            پزشک در این مرکز برنامه کاری ندارد.
          </Text>
        ) : schedulesQuery.isLoading || schedulesQuery.isFetching ? (
          <div className="space-y-2">
            <Skeleton w="100%" h="2.5rem" rounded="lg" />
            <Skeleton w="100%" h="10rem" rounded="lg" />
          </div>
        ) : !hasAnySchedules ? (
          <Text fontSize="sm" className="text-center text-slate-500">
            پزشک در این مرکز برنامه کاری ندارد.
          </Text>
        ) : (
          <>
            {services.length > 1 && (
              <div className="relative">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-right"
                  onClick={() => setIsServiceMenuOpen(open => !open)}
                >
                  <Text fontSize="sm" fontWeight="semiBold" className="line-clamp-2">
                    {selectedService?.title ?? 'انتخاب خدمت'}
                  </Text>
                  <ChevronIcon dir="bottom" className="shrink-0 opacity-70" />
                </button>

                {isServiceMenuOpen && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-md">
                    {services.map(service => {
                      const hasSchedules = Array.isArray(service.schedules) && service.schedules.length > 0;

                      return (
                        <button
                          key={service.id}
                          type="button"
                          className={classNames(
                            'block w-full px-3 py-2.5 text-right text-sm hover:bg-slate-50',
                            service.id === selectedServiceId && 'bg-primary/5 text-primary',
                            !hasSchedules && 'text-slate-400',
                          )}
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setIsServiceMenuOpen(false);
                          }}
                        >
                          {service.title}
                          {!hasSchedules ? ' (بدون ساعت کاری)' : ''}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {WEEK_DAYS.map(day => (
                <div key={day.english} className="flex items-start justify-between gap-3 px-3 py-2.5">
                  <Text fontSize="sm" fontWeight="semiBold" className="shrink-0 text-slate-700">
                    {day.persian}
                  </Text>
                  <Text fontSize="sm" className="text-left leading-6 text-slate-600">
                    {getSchedulesForDay(selectedService?.schedules, day.english)}
                  </Text>
                </div>
              ))}
            </div>
          </>
        )}

        <Button block onClick={handleClose}>
          بستن
        </Button>
      </Modal>
    </>
  );
});

CenterWorkHours.displayName = 'CenterWorkHours';

export default CenterWorkHours;
