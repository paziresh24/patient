import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import { Service } from '../../types/selectService';
interface SelectServiceProps {
  services: Service[];
  onSelect: (service: Service) => void;
}

export const SelectService = (props: SelectServiceProps) => {
  const { services, onSelect } = props;
  const handleSelectService = (service: Service) => {
    onSelect(service);
  };

  return (
    <>
      {services.map((service, index) => (
        <>
          <div
            key={service.id}
            onClick={() => handleSelectService(service)}
            className={clsx(
              'w-full h-auto rounded-md whitespace-nowrap overflow-hidden text-ellipsis block p-4 bg-[#3861FB]/[0.1] cursor-pointer',
              {
                'bg-[#0F1D40]/[0.1] pointer-events-none': service.isDisable,
                'mt-4': index !== 0,
              },
            )}
          >
            <Text>{service.name}</Text>
          </div>
        </>
      ))}
    </>
  );
};

export default SelectService;
