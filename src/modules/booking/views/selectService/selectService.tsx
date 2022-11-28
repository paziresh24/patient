import Text from '@/common/components/atom/text';
import clsx from 'clsx';

interface SelectServiceProps {
  name: string;
  id: string;
  disable: boolean;
}

export const SelectService = (props: SelectServiceProps) => {
  const { name, id, disable } = props;
  return (
    <>
      <div
        className={clsx(
          'w-full h-auto rounded-md whitespace-nowrap overflow-hidden text-ellipsis block p-4 bg-[#3861FB]/[0.1] cursor-pointer',
          {
            'bg-[#0F1D40]/[0.1] pointer-events-none': disable,
          },
        )}
      >
        <Text>{name}</Text>
      </div>
    </>
  );
};

export default SelectService;
