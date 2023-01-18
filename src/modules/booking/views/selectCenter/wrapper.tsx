import Text from '@/common/components/atom/text';
import SelectCenter, { CenterProps } from './selectCenter';

export const SelectCenterWrapper = (props: CenterProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <Text fontWeight="bold">انتخاب مرکز درمانی</Text>
      <SelectCenter {...props} />
    </div>
  );
};

export default SelectCenterWrapper;
