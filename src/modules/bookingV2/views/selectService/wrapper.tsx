import Text from '@/common/components/atom/text';
import SelectService, { SelectServiceProps } from './selectService';

export const SelectServiceWrapper = (props: SelectServiceProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <Text fontWeight="bold">انتخاب خدمت</Text>
      <SelectService {...props} />
    </div>
  );
};

export default SelectServiceWrapper;
