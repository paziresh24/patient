import { CENTERS } from '@/common/types/centers';

export const reformattedCentersProperty = ({ centers, displayName }: { centers: any[]; displayName: string }) => {
  const nowUnix = Math.floor(new Date().getTime() / 1000);

  return (
    centers
      ?.map((center: any) => {
        const freeturnsInfo = center.freeturns_info?.[0];
        const services = Array.isArray(center.services) ? center.services : [];
        const hasFutureAvailabilityWindow =
          typeof freeturnsInfo?.available_time === 'number' && freeturnsInfo.available_time > nowUnix;

        return {
          ...center,
          name: center.id === CENTERS.CONSULT ? 'ویزیت آنلاین' : center.center_type === 1 ? `مطب ${displayName}` : center.name,
          address: center.id === CENTERS.CONSULT ? '' : center.address,
          freeturn: center.freeturn_text,
          type: center.id === '5532' ? 'consult' : center.center_type === 1 ? 'office' : 'hospital',
          phoneNumbers: center.display_number_array,
          // Future open-window must not look like permanently disabled booking.
          isDisable: !center.is_active && !hasFutureAvailabilityWindow,
          isAvailable:
            services.length === 1 && !!freeturnsInfo
              ? freeturnsInfo.available_time <= nowUnix
              : !hasFutureAvailabilityWindow,
          availableTime: freeturnsInfo?.availalbe_time_text,
          services,
          waitingTimeInfo: center?.waiting_time_info,
        };
      })
      .filter(center => (center.id === '5532' ? !center.isDisable : true)) ?? []
  );
};
