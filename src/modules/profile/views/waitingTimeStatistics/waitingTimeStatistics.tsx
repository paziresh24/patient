import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';

interface WaitingTimeStatisticsProps {
  slug: string;
  className?: string;
  statistics?: [];
}

const statisticsTemplate = {
  '0': {
    waiting_time: 0,
    waiting_time_count: 0,
    waiting_time_title: `کمتر از نیم ساعت`,
  },
  '1': {
    waiting_time: 1,
    waiting_time_count: 0,
    waiting_time_title: `کمتر از ۱ ساعت`,
  },
  '2': {
    waiting_time: 2,
    waiting_time_count: 0,
    waiting_time_title: `بین ۱ تا ۲ ساعت`,
  },
  '3': {
    waiting_time: 3,
    waiting_time_count: 0,
    waiting_time_title: `بیش از ۲ ساعت`,
  },
};

const options = {
  responsive: true,
  layout: {
    padding: 0,
  },
  plugins: {
    legend: {
      display: true,
      position: 'left',
      maxWidth: 500,
      rtl: true,
      textDirection: 'rtl',
      labels: {
        padding: 15,
        usePointStyle: true,
        color: 'black',
        font: {
          size: 12,
          weight: 'bold',
          // family: "'var(--font-iran-sans)'",
          family: "inherit",
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  },
};

const generateLable = (count: number, total: number) => {
  const percent = parseInt(((count / total) * 100).toFixed()) || 0;
  return `%‎${percent.toLocaleString('fa')} `;
};

const WaitingTimeStatistics = (props: WaitingTimeStatisticsProps) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const { className, statistics = [] } = props;

  const datasets = useMemo(() => {
    let data = structuredClone(statisticsTemplate);
    let total = 0;

    statistics.forEach((item: any) => {
      total += item.waiting_time_count;
      data[item.waiting_time].waiting_time_count += item.waiting_time_count;
    });

    return {
      total,
      data,
      values: Object.values(data).map( wt => wt.waiting_time_count ),
      legendLabels: Object.values(data).map( (wt, index) => generateLable(wt.waiting_time_count, total) + wt.waiting_time_title)
    }
  }, [statistics]);

  const data = {
    labels: datasets.legendLabels,
    datasets: [
      {
        data: datasets.values,
        backgroundColor: ['rgba(57, 146, 61, 1)', 'rgba(58, 180, 64, 1)', 'rgba(255, 173, 13, 1)', 'rgba(240, 115, 0, 1)'],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={className}>
      <div className={`w-80 mx-auto`}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default WaitingTimeStatistics;
