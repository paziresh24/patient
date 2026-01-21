import RangeSlider from '@/common/components/atom/rangeSlider';
import Text from '@/common/components/atom/text';
import { useFilterChange } from '@/modules/search/hooks/useFilterChange';
import { addCommas } from '@/common/utils/persianTools';
import 'chart.js/auto';
import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, highlight }: any) => {
  const barData = {
    labels: data.map((item: any) => item.lable),
    datasets: [
      {
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
        backgroundColor: data.map((_: any, i: number) => (i >= highlight[0] && i <= highlight[1] ? '#3861fb' : '#e2e8f0')),
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        data: data.map((item: any) => item.count),
      },
    ],
  };

  const options = {
    responsive: true,
    subtitle: {
      display: false,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },

      y: {
        display: false,
      },
    },
  };
  return <Bar data={barData} options={options} />;
};

export const SliderFilter = (props: any) => {
  const { handleChange } = useFilterChange();

  const [selectedRange, setSelectedRange] = useState<[number, number]>(props.value);
  const avarage = useMemo(() => {
    const rangeSlice = (props.data as any[]).slice(selectedRange[0], selectedRange[1]).filter((item: any) => +item.count !== 0);
    const minValue = rangeSlice[0]?.value?.split('_')[0] * 1000;
    const maxValue =
      rangeSlice[rangeSlice.length - 1]?.value?.split('_')[1] === 'inf'
        ? rangeSlice[rangeSlice.length - 1]?.value?.split('_')[0] * 1000
        : rangeSlice[rangeSlice.length - 1]?.value?.split('_')[1] * 1000;

    const sumSelected = rangeSlice.length;
    if (!sumSelected) return 0;
    return Math.floor((minValue + maxValue) / (sumSelected * 2));
  }, [selectedRange]);

  const handleMouseUp = () => {
    handleChange(
      props.name,
      (props.data as any[])
        .slice(selectedRange[0], selectedRange[1])
        .filter((item: any) => +item.count !== 0)
        .map(item => item.value),
    );
  };

  useEffect(() => {
    setSelectedRange(props.value);
  }, [props.value]);

  return (
    <div className="flex flex-col space-y-2">
      <Text fontWeight="bold" className="mb-1">
        {props.title}
      </Text>
      <Text fontWeight="bold" className="mb-1" fontSize="sm" align="center">
        {addCommas(props.data?.[selectedRange[0]]?.value?.split('_')[0] * 1000)} -{' '}
        {addCommas(
          props.data?.[selectedRange[1] - 1]?.value?.split('_')[1] === 'inf'
            ? addCommas(props.data?.[props.max]?.value?.split('_')[0] * 1000) + '+'
            : props.data?.[selectedRange[1] - 1]?.value?.split('_')[1] * 1000,
        )}
      </Text>
      <Text fontWeight="bold" className="mb-1 opacity-60" fontSize="xs" align="center">
        میانگین قیمت {addCommas(avarage)} تومان است.
      </Text>
      <div style={{ direction: 'ltr' }} className="flex flex-col space-y-3">
        <BarChart data={props.data} highlight={selectedRange} />
        <RangeSlider
          min={props.min}
          max={props.max + 1}
          step={1}
          onChange={value => setSelectedRange(value)}
          onTouchEnd={handleMouseUp}
          onMouseUp={handleMouseUp}
          value={selectedRange}
        />
        <div className="flex justify-between select-none">
          <Text fontSize="xs">{addCommas(props.data?.[props.min]?.value?.split('_')[0] * 1000)}</Text>{' '}
          <Text fontSize="xs">+{addCommas(props.data?.[props.max]?.value?.split('_')[0] * 1000)}</Text>
        </div>
      </div>
    </div>
  );
};

export default SliderFilter;
