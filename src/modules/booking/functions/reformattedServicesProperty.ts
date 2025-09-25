export const reformattedServicesProperty = ({ services, center }: { services: any[]; center: any }) => {
  return services?.map((service: any) => {
    const freeturnsInfo = center.freeturns_info?.find((s: any) => s.service_id === service.id);
    return {
      id: service.id,
      name: service.alias_title,
      isDisable: !service.can_booking || service.can_booking === 0,
      isAvailable: !freeturnsInfo?.available_time || freeturnsInfo?.available_time < Math.floor(new Date().getTime() / 1000),
      availableTime: freeturnsInfo?.availalbe_time_text,
      userCenterId: service.user_center_id,
    };
  });
};
