import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import ChevronIcon from '@/common/components/icons/chevron';
import { Center } from '@/common/types/doctorParams';
import classNames from '@/common/utils/classNames';
import Notification from '@/modules/profile/components/notification/notification';
import orderBy from 'lodash/orderBy';
import { Service } from '../../types/selectService';
export interface SelectServiceProps {
  services: Service[];
  loading?: boolean;
  onSelect: (service: Service) => void;
  center: Center;
}

export const SelectService = (props: SelectServiceProps) => {
  const { services, onSelect, loading = false, center } = props;
  const handleSelectService = (service: Service) => {
    if (service.isDisable || !service.isAvailable) return;
    onSelect(service);
  };

  if (loading)
    return (
      <div className="flex flex-col space-y-2">
        <Skeleton w="100%" h="3.5rem" rounded="md" />
        <Skeleton w="100%" h="3.5rem" rounded="md" />
        <Skeleton w="100%" h="3.5rem" rounded="md" />
      </div>
    );
  return (
    <div className="flex flex-col space-y-2">
      {orderBy(services, ['isDisable', o => !o.isAvailable]).map((service, index) => (
        <div
          key={service.id}
          onClick={() => handleSelectService(service)}
          className={classNames('w-full flex flex-col h-auto rounded-md bg-[#3861FB]/[0.2] cursor-pointer', {
            'bg-slate-200 border border-slate-200  text-slate-600 cursor-default': service.isDisable || !service.isAvailable,
          })}
        >
          <div className="flex items-center justify-between p-3">
            <Text fontWeight="semiBold" fontSize="sm" className="line-clamp-2">
              {service.name}
            </Text>
            <ChevronIcon dir="left" className="min-w-2" />
          </div>
          {!service.isAvailable && service.availableTime && (
            <Notification
              centerId={center.id ?? ''}
              serviceId={service.id}
              userCenterId={service.userCenterId ?? ''}
              availalbeTime={service.availableTime ?? ''}
              className="!mt-0 m-2 !p-3"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectService;
