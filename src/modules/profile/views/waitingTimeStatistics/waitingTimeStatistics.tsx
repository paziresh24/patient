import { useMemo } from 'react';
import WaitingTimeChart from './waitingTimeChart';
import { sortBy } from 'lodash';

interface Statistics {
  waiting_time: number;
  waiting_time_title: string;
  waiting_time_count: number;
  waiting_time_percent: number;
}

interface WaitingTimeStatisticsProps {
  className?: string;
  statistics: Statistics[];
}

const WaitingTimeStatistics = (props: WaitingTimeStatisticsProps) => {
  const { className, statistics = [] } = props;

  const data = useMemo(() => {
    const sortedData = sortBy(statistics, 'waiting_time');
    return sortedData.map((item: Statistics, index) => {
      return {
        index,
        type: item.waiting_time,
        value: item.waiting_time_percent,
        name: item.waiting_time_title,
      };
    });
  }, [statistics]);

  return (
    <div className={className}>
      <div className={`w-[300px] mx-auto`}>
        <WaitingTimeChart data={data} />
      </div>
    </div>
  );
};

export default WaitingTimeStatistics;
