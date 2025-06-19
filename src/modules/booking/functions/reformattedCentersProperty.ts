import { CENTERS } from '@/common/types/centers';

export const reformattedCentersProperty = ({ centers, displayName }: { centers: any[]; displayName: string }) => {
  return (
    centers
      ?.map((center: any) => {
        const freeturnsInfo = center.freeturns_info?.[0];
        return {
          ...center,
          name: center.id === CENTERS.CONSULT ? 'ویزیت آنلاین' : center.center_type === 1 ? `مطب ${displayName}` : center.name,
          address: center.id === CENTERS.CONSULT ? '' : center.address,
          freeturn: center.freeturn_text,
          type: center.id === '5532' ? 'consult' : center.center_type === 1 ? 'office' : 'hospital',
          phoneNumbers: center.display_number_array,
          isDisable: !center.is_active,
          isAvailable:
            center.services.length === 1 && !!freeturnsInfo
              ? freeturnsInfo?.available_time <= Math.floor(new Date().getTime() / 1000)
              : true,
          availableTime: freeturnsInfo?.availalbe_time_text,
          services: center.services,
          waitingTimeInfo: center?.waiting_time_info,
        };
      })
      .filter(center => (center.id === '5532' ? !center.isDisable : true)) ?? []
  );
};
