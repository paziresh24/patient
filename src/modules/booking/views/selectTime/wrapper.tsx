import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { BaseInfo } from '../../types/baseInfo';
import SelectTime from './selectTime';

interface SelectTimeWrapperProps extends BaseInfo {
  onSubmit: (timeId: string) => void;
}

export const SelectTimeWrapper = (props: SelectTimeWrapperProps) => {
  const { onSubmit, ...baseInfo } = props;
  const [timeId, setTimeId] = useState('');

  const handleSubmit = (id: string) => {
    if (!id) return toast.warn('لطفا زمان مورد نظر خود را انتخاب کنید');
    onSubmit(id);
  };

  const handleSelect = ({ timeId, forceClick }: { timeId: string; forceClick: boolean }) => {
    setTimeId(timeId);
    if (forceClick) handleSubmit(timeId);
  };

  return (
    <div className="flex flex-col space-y-3">
      <Text fontWeight="bold">انتخاب زمان نوبت</Text>
      <SelectTime {...baseInfo} onSelect={handleSelect} />
      <Button className="self-end w-1/5" onClick={() => handleSubmit(timeId)}>
        ادامه
      </Button>
    </div>
  );
};

export default SelectTimeWrapper;
