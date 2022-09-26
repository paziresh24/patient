import { useGetFreeDays } from '@/common/apis/services/booking/getFreeDays';
import { useGetFreeTurns } from '@/common/apis/services/booking/getFreeTurns';
import Loading from '@/common/components/atom/loading';
import Skeleton from '@/common/components/atom/skeleton';
import { Tab, Tabs } from '@/common/components/atom/tabs';
import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import moment from 'jalali-moment';
import range from 'lodash/range';
import { useEffect, useMemo, useState } from 'react';
import { useBookingStore } from '../../store/booking';

interface SelectOtherTurnTimeProps {
  onSelectTime: ({ from, to }: { from: number; to: number }) => void;
}

export const SelectOtherTurnTime = (props: SelectOtherTurnTimeProps) => {
  const { onSelectTime } = props;
  const { centerId, serviceId, userCenterId } = useBookingStore(state => state.center);
  const getFreeDays = useGetFreeDays();
  const getFreeTurns = useGetFreeTurns();
  const [tabState, setTabState] = useState<'morning' | 'evening'>('morning');
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const {
      data: {
        calendar: { turns },
      },
    } = await getFreeDays.mutateAsync({
      center_id: centerId,
      service_id: serviceId,
      user_center_id: userCenterId,
      return_free_turns: false,
      return_type: 'calendar',
    });
    handleGetFreeTurns(turns[0]);
  };

  const handleGetFreeTurns = (turnDay: string) => {
    return getFreeTurns.mutateAsync({
      center_id: centerId,
      service_id: serviceId,
      user_center_id: userCenterId,
      date: turnDay,
    });
  };

  const handleClickDay = async (index: number) => {
    setSelectedDay(index);
    await handleGetFreeTurns(getFreeDays.data?.data?.calendar?.turns[index]);
  };

  const turnsTime = useMemo(() => {
    const morning: any[] = [];
    const evening: any[] = [];
    if (getFreeTurns.isSuccess) {
      getFreeTurns.data?.data?.result?.forEach((turn: any) => {
        if (
          +moment(turn.from * 1000)
            .locale('fa')
            .format('HH') >= 12
        ) {
          evening.push(turn);
        } else {
          morning.push(turn);
        }
      });
    }
    return { morning, evening };
  }, [getFreeTurns.data, getFreeTurns.isSuccess]);

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-s-3">
      <div className="flex md:flex-col w-full space-s-3 md:space-s-0 md:w-36 md:h-96 overflow-auto md:space-y-3">
        {(getFreeDays.isLoading || getFreeDays.isIdle) && <FreeDaysLoading />}
        {getFreeDays.isSuccess &&
          getFreeDays.data?.data?.calendar?.turns?.map((turn: string, index: number) => (
            <div
              className={clsx('cursor-pointer min-w-fit flex flex-col border border-solid border-slate-200 rounded-lg p-3', {
                'bg-primary bg-opacity-5 border-primary border-opacity-30 text-primary': selectedDay === index,
              })}
              key={turn}
              onClick={() => handleClickDay(index)}
            >
              <Text fontWeight="medium">
                {moment(+turn * 1000)
                  .locale('fa')
                  .calendar(undefined, {
                    sameDay: '[امروز]',
                    nextDay: '[فردا]',
                    nextWeek: 'dddd',
                    sameElse: 'dddd',
                  })}
              </Text>
              <Text fontSize="sm">
                {moment(+turn * 1000)
                  .locale('fa')
                  .format('DD MMMM')}
              </Text>
            </div>
          ))}
      </div>
      <div className="w-full border border-solid border-slate-200 rounded-lg">
        <Tabs value={tabState} onChange={(value: any) => setTabState(value)} className="border-b border-solid border-slate-200">
          <Tab value="morning" label="صبح" className="w-full" />
          <Tab value="evening" label="عصر" className="w-full" />
        </Tabs>
        <div className="flex overflow-auto gap-3 flex-wrap h-44 md:h-80 p-4">
          {(getFreeTurns.isLoading || getFreeTurns.isIdle) && <Loading className="self-center mx-auto" />}
          {getFreeTurns.isSuccess &&
            turnsTime[tabState].map(turn => (
              <div
                key={turn.from}
                className="flex-[1_1_4rem] md:flex-[1_1_5rem] cursor-pointer border border-solid p-2 md:p-3 text-center rounded-lg transition-colors border-slate-200 hover:border-primary"
                onClick={() => {
                  onSelectTime({
                    from: turn.from,
                    to: turn.to,
                  });
                }}
              >
                {moment(turn.from * 1000)
                  .locale('fa')
                  .format('LT')}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const FreeDaysLoading = () => (
  <>
    {range(0, 5).map(item => (
      <Skeleton key={item} h="70px" w="100%" rounded="lg" />
    ))}
  </>
);

export default SelectOtherTurnTime;
