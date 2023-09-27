import Skeleton from '@/common/components/atom/skeleton';
import { Tab, Tabs } from '@/common/components/atom/tabs';
import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
import moment from 'jalali-moment';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import { useEffect, useState } from 'react';

export interface SelectOtherTurnTimeProps {
  slots: Slot[];
  onSelectTime: ({ time }: { time?: string }) => void;
}
type Slot = {
  date: string;
  slots: {
    time: string;
  }[];
};

export const SelectOtherTurnTime = (props: SelectOtherTurnTimeProps) => {
  const { slots, onSelectTime } = props;
  const [tabState, setTabState] = useState<'morning' | 'evening'>('morning');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>('');
  const [times, setTimes] = useState<any>();

  useEffect(() => {
    if (!isEmpty(slots[0])) handleClickDay(slots[0].date);
  }, [slots]);

  const handleClickDay = async (date: string) => {
    setSelectedDay(date);
    turnsTime(slots.find(slot => slot.date === date)?.slots ?? []);
    onSelectTime({});
    setSelectedSlot(undefined);
  };

  const turnsTime = (times: { time: string }[]) => {
    const morning: any[] = [];
    const evening: any[] = [];

    times.forEach(slot => {
      if (+moment(slot.time).locale('fa').format('HH') >= 12) {
        evening.push(slot);
      } else {
        morning.push(slot);
      }
    });

    setTabState(isEmpty(morning) ? 'evening' : 'morning');

    setTimes({ morning, evening });
  };

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-s-1">
      <div className="flex w-full pb-2 overflow-auto md:flex-col space-s-2 md:space-s-0 md:w-36 md:h-80 md:space-y-2 md:pb-0 md:pl-1">
        {isEmpty(slots) && <FreeDaysLoading />}
        {slots?.map((slot, index: number) => (
          <div
            className={classNames(
              'cursor-pointer min-w-max w-full flex flex-col border border-solid border-slate-200 rounded-lg pl-6 py-2 p-3',
              {
                'bg-primary bg-opacity-5 border-primary border-opacity-30 text-primary': selectedDay === slot.date,
              },
            )}
            key={slot.date}
            onClick={() => handleClickDay(slot.date)}
          >
            <Text fontWeight="medium">
              {moment(slot.date).locale('fa').calendar(undefined, {
                sameDay: '[امروز]',
                nextDay: '[فردا]',
                nextWeek: 'dddd',
                sameElse: 'dddd',
              })}
            </Text>
            <Text fontSize="sm">{moment(slot.date).locale('fa').format('DD MMMM')}</Text>
          </div>
        ))}
      </div>
      <div className="w-full overflow-auto border border-solid rounded-lg md:h-80 border-slate-200">
        {(!isEmpty(times?.morning) || !isEmpty(times?.evening)) && (
          <Tabs
            value={tabState}
            onChange={(value: any) => setTabState(value)}
            className="sticky top-0 bg-white border-b border-solid border-slate-200"
          >
            <Tab value="morning" label="صبح" className="w-full" />
            <Tab value="evening" label="عصر" className="w-full" />
          </Tabs>
        )}
        {isEmpty(times?.[tabState]) && (
          <div className="flex items-center justify-center w-full py-5 h-2/3 md:pt-10">
            <Text fontWeight="bold" fontSize="sm">
              نوبت پزشک در این روز به پایان رسیده است.
            </Text>
          </div>
        )}
        {!isEmpty(times?.[tabState]) && (
          <div className="flex flex-wrap gap-3 p-3 m-1">
            {times?.[tabState]?.map((slot: any) => (
              <div
                key={slot.time}
                className={classNames(
                  'flex-[1_1_4rem] md:flex-[1_1_5rem] cursor-pointer border border-solid p-2 md:p-3 text-center rounded-lg transition-colors border-slate-200 hover:border-primary',
                  {
                    'bg-primary bg-opacity-5 border-primary border-opacity-30 text-primary': selectedSlot === slot.time,
                  },
                )}
                onClick={() => {
                  onSelectTime({
                    time: slot.time,
                  });
                  setSelectedSlot(slot.time);
                }}
              >
                {moment(slot.time).locale('fa').format('LT')}
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
