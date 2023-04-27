import Divider from '@/common/components/atom/divider/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import ChevronIcon from '@/common/components/icons/chevron';
import classNames from '@/common/utils/classNames';
import orderBy from 'lodash/orderBy';
import { Service } from '../../types/selectService';
export interface SelectServiceProps {
  services: Service[];
  loading?: boolean;
  onSelect: (service: Service) => void;
}

export const SelectService = (props: SelectServiceProps) => {
  const { services, onSelect, loading = false } = props;
  const handleSelectService = (service: Service) => {
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
            'bg-slate-200 border border-slate-200 pointer-events-none text-slate-600': service.isDisable || !service.isAvailable,
          })}
        >
          <div className="flex items-center justify-between p-3">
            <Text fontWeight="semiBold" fontSize="sm" className="line-clamp-1">
              {service.name}
            </Text>
            <ChevronIcon dir="left" className="min-w-2" />
          </div>
          {!service.isAvailable && service.availableTime && (
            <>
              <Divider className="bg-slate-300" />
              <div className="flex justify-between w-full p-3">
                <Text fontSize="sm" className="text-black/">
                  نوبت دهی اینترنتی:
                </Text>
                <Text fontSize="sm" className="block text-slate-500">
                  {service.availableTime}
                </Text>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectService;
