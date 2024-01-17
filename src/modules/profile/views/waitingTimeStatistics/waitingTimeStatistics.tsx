import { ArcElement, Chart as ChartJS, type ChartOptions, Legend, Tooltip } from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface statistics {
  waiting_time: number,
  waiting_time_title: string,
  waiting_time_count: number,
  waiting_time_percent: number
}

interface WaitingTimeStatisticsProps {
  slug: string;
  className?: string;
  statistics: statistics[];
}

const WaitingTimeStatistics = (props: WaitingTimeStatisticsProps) => {
  const { className, statistics = [] } = props;
  const [options, setOptions] = useState<ChartOptions<'pie'>>({});

  const datasets = useMemo(() => {
    const total = Object.values(statistics).length
    return {
      total: total,
      data: Object.values(statistics),
      values: Object.values(statistics).map((wt: any) => wt.waiting_time_percent),
      legendLabels: Object.values(statistics).map((wt, index) => `%‎${wt.waiting_time_percent.toLocaleString('fa')} ` + wt.waiting_time_title),
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

  useEffect(() => {
    const style = getComputedStyle(document.body);
    const font = style.getPropertyValue('--font-iran-sans');
    setOptions({
      responsive: true,
      aspectRatio: 1,
      maintainAspectRatio: false,
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
              weight: 'normal',
              family: font,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    });
  }, []);

  return (
    <div className={className}>
      <div className={`flex justify-center`}>
        <div>
          <Pie data={data} options={options} className="!w-[300px] !h-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default WaitingTimeStatistics;
