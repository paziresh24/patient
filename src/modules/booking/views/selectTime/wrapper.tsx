import Button from '@/common/components/atom/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BaseInfo } from '../../types/baseInfo';
import SelectTime from './selectTime';

interface SelectTimeWrapperProps extends BaseInfo {
  onSubmit: (timeId: string) => void;
  loading: boolean;
}

export const SelectTimeWrapper = (props: SelectTimeWrapperProps) => {
  const { onSubmit, loading, ...baseInfo } = props;
  const [timeId, setTimeId] = useState('');

  const handleSubmit = (id: string) => {
    if (!id) return toast.error('لطفا زمان مورد نظر خود را انتخاب کنید');
    onSubmit(id);
  };

  const handleSelect = ({ timeId, forceClick }: { timeId: string; forceClick: boolean }) => {
    setTimeId(timeId);
    if (forceClick) handleSubmit(timeId);
  };

  return (
    <>
      <SelectTime {...baseInfo} loading={loading} onSelect={handleSelect} />
      <div className="p-4 flex flex-col md:p-0 fixed md:static bottom-0 w-full md:w-auto right-0  bg-white md:bg-transparent shadow-card md:shadow-none">
        <Button className="self-end w-full md:w-1/5" onClick={() => handleSubmit(timeId)}>
          ادامه
        </Button>
      </div>
    </>
  );
};

export default SelectTimeWrapper;
