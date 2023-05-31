import { useSuspend } from '@/common/apis/services/booking/suspend';
import { useUnsuspend } from '@/common/apis/services/booking/unsuspend';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import { useEffect, useState } from 'react';
import FreeTurn from '../../components/selectTime/freeTurn';
import OtherTimes from '../../components/selectTime/otherTimes';
import useFirstFreeTime from '../../hooks/selectTime/useFirstFreeTime';
import useOtherTimes from '../../hooks/selectTime/useOtherTimes';
import { BaseInfo } from '../../types/baseInfo';

interface SelectTimeProps extends BaseInfo {
  onSelect: ({
    timeId,
    timeStamp,
    timeText,
    forceClick,
  }: {
    timeId: string;
    timeStamp: number;
    timeText: string;
    forceClick: boolean;
  }) => void;
  loading?: boolean;
  onFirstFreeTimeError?: (errorText: string) => void;
  events?: Events;
  showOnlyFirstFreeTime?: boolean;
}

export type Events = {
  onFirstFreeTime: (data: any) => void;
  onOtherFreeTime: (data: any) => void;
};

enum TimeMode {
  'FIRST_FREE_TURN' = 'FIRST_FREE_TURN',
  'OTHER_FREE_TURN' = 'OTHER_FREE_TURN',
}

export const SelectTimeUi = (props: SelectTimeProps) => {
  const { onSelect, loading, onFirstFreeTimeError, events, showOnlyFirstFreeTime = false, ...baseInfo } = props;

  const { getDays, ...otherTimes } = useOtherTimes({ ...baseInfo, onEvent: data => events?.onOtherFreeTime?.(data) });
  const firstFreeTime = useFirstFreeTime({
    ...baseInfo,
    enabled: !loading,
    onError: onFirstFreeTimeError,
    onEvent: data => events?.onFirstFreeTime?.(data),
  });

  const suspend = useSuspend();
  const unSuspend = useUnsuspend();

  const [timeMode, setTimeMode] = useState<TimeMode>(TimeMode.FIRST_FREE_TURN);

  useEffect(() => {
    if (firstFreeTime.isSuccess) {
      handleSelectTime({
        timeId: firstFreeTime.timeId!,
        timeStamp: firstFreeTime.timeStamp!,
        timeText: firstFreeTime.timeText!,
      });
    }
  }, [firstFreeTime.isSuccess, firstFreeTime.timeId]);

  const timeModeAction = {
    FIRST_FREE_TURN: async () => {
      if (timeMode === TimeMode.FIRST_FREE_TURN) return null;
      setTimeMode(TimeMode.FIRST_FREE_TURN);
      const data = await firstFreeTime.getFirstFreeTime();
      handleSelectTime(
        {
          timeId: firstFreeTime.timeId!,
          timeStamp: firstFreeTime.timeStamp!,
          timeText: firstFreeTime.timeText!,
        },
        'forceClick',
      );
    },
    OTHER_FREE_TURN: () => {
      if (timeMode === TimeMode.FIRST_FREE_TURN) {
        unSuspend.mutate({
          center_id: baseInfo.centerId,
          request_code: firstFreeTime.timeId!,
        });
        getDays();
        setTimeMode(TimeMode.OTHER_FREE_TURN);
        handleSelectTime({
          timeId: '',
          timeStamp: 0,
          timeText: '',
        });
      }
    },
  };

  const handleSelectTime = async (
    {
      timeId,
      timeStamp,
      timeText,
    }: {
      timeId: string;
      timeStamp: number;
      timeText: string;
    },
    forceClick?: string,
  ) => {
    onSelect({ timeId, timeStamp, timeText, forceClick: !!forceClick });
  };

  return (
    <div
      className={classNames('flex flex-col space-y-3', {
        'animate-pulse opacity-75 pointer-events-none': suspend.isLoading,
      })}
    >
      <FreeTurn
        {...firstFreeTime}
        loading={loading || firstFreeTime.loading}
        onSelect={timeModeAction[TimeMode.FIRST_FREE_TURN]}
        selected={timeMode === TimeMode.FIRST_FREE_TURN}
        title={baseInfo.centerId === CENTERS.CONSULT ? 'پاسخگویی پزشک' : 'زودترین زمان نوبت خالی'}
      />
      {!showOnlyFirstFreeTime && (
        <OtherTimes
          {...otherTimes}
          onSelect={timeModeAction[TimeMode.OTHER_FREE_TURN]}
          selected={timeMode === TimeMode.OTHER_FREE_TURN}
          onSelectTime={async ({ from, to }) => {
            const { data } = await suspend.mutateAsync({
              center_id: baseInfo.centerId,
              service_id: baseInfo.serviceId,
              user_center_id: baseInfo.userCenterId,
              from,
              to,
            });
            handleSelectTime({ timeId: data.request_code, timeStamp: from, timeText: '' }, 'forceClick');
          }}
        />
      )}
    </div>
  );
};

export default SelectTimeUi;
