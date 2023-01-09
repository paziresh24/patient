import Loading from '@/common/components/atom/loading';
import Skeleton from '@/common/components/atom/skeleton';
import { Tab, Tabs } from '@/common/components/atom/tabs';
import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import moment from 'jalali-moment';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import { useEffect, useState } from 'react';

export interface SelectOtherTurnTimeProps {
  days: number[];
  onSelectDay: (dayTimeStamp: number) => Promise<Time[]> | Time[];
  onSelectTime: ({ from, to }: Time) => void;
}
type Time = Record<'from' | 'to', number>;

export const SelectOtherTurnTime = (props: SelectOtherTurnTimeProps) => {
  const { days, onSelectDay, onSelectTime } = props;
  const [tabState, setTabState] = useState<'morning' | 'evening'>('morning');
  const [selectedDay, setSelectedDay] = useState(0);
  const [times, setTimes] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isEmpty(days)) handleClickDay(days[0]);
    setIsLoading(true);
  }, [days]);

  const handleClickDay = async (dayTimeStamp: number) => {
    setIsLoading(true);
    setSelectedDay(dayTimeStamp);
    setTimes({});
    const times = await onSelectDay(dayTimeStamp);
    turnsTime(times);
    setIsLoading(false);
  };

  const turnsTime = (times: any[]) => {
    const morning: any[] = [];
    const evening: any[] = [];

    times.forEach((turn: any) => {
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

    setTabState(isEmpty(morning) ? 'evening' : 'morning');

    setTimes({ morning, evening });
  };

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-s-1">
      <div className="flex w-full pb-2 overflow-auto md:flex-col space-s-2 md:space-s-0 md:w-36 md:h-80 md:space-y-2 md:pb-0 md:pl-1">
        {isEmpty(days) && <FreeDaysLoading />}
        {days?.map((turn: number, index: number) => (
          <div
            className={clsx('cursor-pointer min-w-fit flex flex-col border border-solid border-slate-200 rounded-lg pl-6 py-2 p-3', {
              'bg-primary bg-opacity-5 border-primary border-opacity-30 text-primary': selectedDay === turn,
            })}
            key={turn}
            onClick={() => handleClickDay(turn)}
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
      <div className="w-full border border-solid rounded-lg md:h-80 border-slate-200">
        {(!isEmpty(times?.morning) || !isEmpty(times?.evening)) && (
          <Tabs value={tabState} onChange={(value: any) => setTabState(value)} className="border-b border-solid border-slate-200">
            <Tab value="morning" label="صبح" className="w-full" />
            <Tab value="evening" label="عصر" className="w-full" />
          </Tabs>
        )}
        {!isLoading && isEmpty(times?.[tabState]) && (
          <div className="flex items-center justify-center w-full h-full py-8 md:py-0 md:!pb-11">
            <Text fontWeight="bold" fontSize="sm">
              نوبت پزشک در این روز به پایان رسیده است.
            </Text>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center w-full h-20 md:h-full">
            <Loading />
          </div>
        )}
        {!isEmpty(times?.[tabState]) && (
          <div className="flex flex-wrap h-64 gap-3 p-3 m-1 overflow-auto">
            {times?.[tabState]?.map((turn: any) => (
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
        )}
      </div>
    </div>
  );
};

const FreeDaysLoading = () => (
  <>
    {range(0, 4).map(item => (
      <Skeleton key={item} h="70px" w="100%" rounded="lg" />
    ))}
  </>
);

export default SelectOtherTurnTime;
