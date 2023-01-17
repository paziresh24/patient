import Button from '@/common/components/atom/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BaseInfo } from '../../types/baseInfo';
import SelectTime, { Events } from './selectTime';

interface SelectTimeWrapperProps extends BaseInfo {
  onSubmit: (timeId: string) => void;
  loading: boolean;
  onFirstFreeTimeError: (errorText: string) => void;
  events?: Events;
}

export const SelectTimeWrapper = (props: SelectTimeWrapperProps) => {
  const { onSubmit, ...rest } = props;
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
      <SelectTime {...rest} onSelect={handleSelect} />
      <div className="fixed bottom-0 right-0 flex flex-col w-full p-4 bg-white border-t md:border-none border-slate-100 md:p-0 md:static md:w-auto md:bg-transparent shadow-card md:shadow-none">
        <Button className="self-end w-full md:w-1/5" onClick={() => handleSubmit(timeId)}>
          ادامه
        </Button>
      </div>
    </>
  );
};

export default SelectTimeWrapper;
