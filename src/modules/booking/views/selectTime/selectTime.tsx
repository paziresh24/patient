import { useGetFreeTurn } from '@/common/apis/services/booking/getFreeTurn';
import { useSuspend } from '@/common/apis/services/booking/suspend';
import { useUnsuspend } from '@/common/apis/services/booking/unsuspend';
import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Select from '../../components/select';
import SelectOtherTurnTime from '../../components/selectOtherTurnTime';
import { useBookingStore } from '../../store/booking';

interface SelectTurnTimeProps {
  onSubmit: () => void;
}

export const SelectTime = (props: SelectTurnTimeProps) => {
  const { onSubmit } = props;
  const { query } = useRouter();
  const center = useBookingStore(state => state.center);
  const setTurnTime = useBookingStore(state => state.setTurnTime);
  const requestCode = useBookingStore(state => state.turnTime.requestCode);
  const getFreeTurn = useGetFreeTurn();
  const unsuspend = useUnsuspend();
  const suspend = useSuspend();
  const [selectedTime, setSelectedTime] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const [type, setType] = useState<'firstTime' | 'otherTimes'>('firstTime');

  useEffect(() => {
    if (center.centerId && center.userCenterId) getAvailableTurnTime();
  }, [center]);

  const getAvailableTurnTime = async () => {
    const { data } = await getFreeTurn.mutateAsync({
      center_id: center.centerId,
      service_id: center.serviceId,
      user_center_id: center.userCenterId,
      type: query.isWebView ? 'app' : 'web',
    });
    if (data.status === 1) {
      setTurnTime({ requestCode: data.result?.request_code });
      setSelectedTime({
        from: data.result?.from,
        to: data.result?.to,
      });
    }
  };

  const handleClickOtherTime = useCallback(() => {
    unsuspend.mutate({
      center_id: center.centerId,
      request_code: requestCode,
    });
    setType('otherTimes');
    setSelectedTime(null);
  }, [center, requestCode]);

  const handleSubmitOtherTime = useCallback(
    async ({ from, to }: { from: number; to: number }) => {
      const { data } = await suspend.mutateAsync({
        center_id: center.centerId,
        service_id: center.serviceId,
        user_center_id: center.userCenterId,
        from,
        to,
      });
      setTurnTime({ requestCode: data.request_code });
      onSubmit();
    },
    [center, requestCode],
  );

  const handleSubmit = useCallback(() => {
    setTurnTime({ requestCode: getFreeTurn.data?.data?.result?.request_code });
    onSubmit();
  }, [getFreeTurn.data]);

  return (
    <div className="flex flex-col space-y-6">
      <Text fontWeight="bold">انتخاب زمان نوبت</Text>
      <div className="flex flex-col space-y-3">
        <Select
          title="زودترین زمان نوبت خالی:"
          subTitle={getFreeTurn.data?.data?.result?.full_date ?? 'زمان نوبت خالی وجود ندارد.'}
          isLoading={!getFreeTurn.isSuccess}
          selected={type === 'firstTime'}
          onSelect={() => {
            setType('firstTime');
            handleSubmit();
          }}
        />
        <Select title="انتخاب زمان دیگر" selected={type === 'otherTimes'} onSelect={handleClickOtherTime} />
        {type === 'otherTimes' && <SelectOtherTurnTime onSelectTime={handleSubmitOtherTime} />}
      </div>
      <Button
        className="self-end w-40"
        disabled={!selectedTime}
        onClick={() => selectedTime && handleSubmit()}
        loading={getFreeTurn.isLoading || suspend.isLoading}
      >
        ادامه
      </Button>
    </div>
  );
};

export default SelectTime;
