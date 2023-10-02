import Button from '@/common/components/atom/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BaseInfo } from '../../types/baseInfo';
import SelectTime, { Events } from './selectTime';

interface SelectTimeWrapperProps extends BaseInfo {
  onSubmit: (freeTurnInfo: FreeTurnInfo) => void;
  loading?: boolean;
  onFirstFreeTimeError?: (errorText: string) => void;
  events?: Events;
  showOnlyFirstFreeTime?: boolean;
  onChangeTimeId?: (freeTurnInfo: FreeTurnInfo) => void;
}

type FreeTurnInfo = { time?: string };

export const SelectTimeWrapper = (props: SelectTimeWrapperProps) => {
  const { onSubmit, onChangeTimeId, ...rest } = props;
  const [freeTurnInfo, setFreeTurnInfo] = useState<FreeTurnInfo>();

  const handleSubmit = ({ time }: FreeTurnInfo) => {
    if (!time) return toast.error('لطفا زمان مورد نظر خود را انتخاب کنید');
    onSubmit({ time });
  };

  return (
    <>
      <SelectTime {...rest} onSelect={slot => setFreeTurnInfo(slot)} />
      <div className="fixed bottom-0 right-0 flex flex-col w-full p-4 bg-white border-t md:border-none border-slate-100 md:p-0 md:static md:w-auto md:bg-transparent shadow-card md:shadow-none">
        <Button
          className="self-end w-full md:w-1/5"
          disabled={!freeTurnInfo?.time}
          onClick={() => freeTurnInfo && handleSubmit(freeTurnInfo)}
        >
          ادامه
        </Button>
      </div>
    </>
  );
};

export default SelectTimeWrapper;
