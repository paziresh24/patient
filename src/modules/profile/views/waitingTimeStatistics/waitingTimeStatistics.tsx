import { useMemo } from 'react';
import WaitingTimeChart from './waitingTimeChart';
import _ from 'lodash';

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
    const sortedData = _.sortBy(statistics, 'waiting_time');
    return sortedData.map((item: Statistics, index) => {
      const round_percent = Math.round(item.waiting_time_percent);
      return {
        ...item,
        index,
        value: round_percent,
        name: item.waiting_time_title,
      };
    });
  }, []);

  return (
    <div className={className}>
      <div className={`w-[300px] mx-auto`}>
        <WaitingTimeChart data={data} />
      </div>
    </div>
  );
};

export default WaitingTimeStatistics;
