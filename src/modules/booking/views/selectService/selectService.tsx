import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
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
      {services.map((service, index) => (
        <>
          <div
            key={service.id}
            onClick={() => handleSelectService(service)}
            className={classNames(
              'w-full h-auto rounded-md whitespace-nowrap overflow-hidden text-ellipsis block p-4 bg-[#3861FB]/[0.1] cursor-pointer',
              {
                'bg-[#0F1D40]/[0.1] pointer-events-none': service.isDisable,
              },
            )}
          >
            <Text>{service.name}</Text>
          </div>
        </>
      ))}
    </div>
  );
};

export default SelectService;
