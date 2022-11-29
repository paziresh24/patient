import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react';
import { selectService } from '../../types/selectService';

interface SelectServiceProps {
  services: selectService[];
  setSelectedServices: Dispatch<SetStateAction<selectService>>;
}

export const SelectService = (props: SelectServiceProps) => {
  const { services, setSelectedServices } = props;
  const handleSelectService = (service: selectService) => {
    setSelectedServices(service);
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
                'bg-[#0F1D40]/[0.1] pointer-events-none': service.disable,
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
