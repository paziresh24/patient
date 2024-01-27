import { useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, DefaultLegendContentProps } from 'recharts';

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

interface WaitingTimeData {
  type: number;
  name: string;
  value: number;
  index: number;
}

interface WaitingTimeChartProps {
  data: WaitingTimeData[]
}

const RADIAN = Math.PI / 170;
const COLORS = ['#39923D', '#3AB440', '#FFAD0D', '#F07300'];

const CustomizedLabel = (props: LabelProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 10) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-semibold outline-none"
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

const InActiveSectorMark = (props: any) => <Sector {...props} fillOpacity={0.3} />;

export default function WaitingTimeChart(props: WaitingTimeChartProps) {
  const { data } = props;
  const [activeSectorIndex, setActiveSectorIndex] = useState<undefined | number>(undefined);

  const CustomLegend = (props: DefaultLegendContentProps) => {
    const { payload } = props;
    return payload?.map((item: any, index: number) => (
      <div
        onMouseEnter={() => setActiveSectorIndex(index)}
        onMouseLeave={() => setActiveSectorIndex(undefined)}
        className={`flex items-center gap-3 ${index === activeSectorIndex ? 'scale-105' : 'scale-100'} origin-right`}
        key={item.value}
      >
        <span className="w-[14px] h-[14px] rounded-full" style={{ backgroundColor: item.color }}></span>
        <div className="flex gap-1">
          <p className="text-sm font-semibold">{Math.round(item.payload.value)}%</p>
          <p className="text-sm">{item.value}</p>
        </div>
      </div>
    ));
  };

  return (
    <ResponsiveContainer width={350} height={160}>
      <PieChart>
        <Pie
          data={data}
          activeIndex={activeSectorIndex}
          inactiveShape={InActiveSectorMark}
          paddingAngle={1}
          cx={'50%'}
          cy={'50%'}
          startAngle={450}
          endAngle={90}
          labelLine={false}
          label={CustomizedLabel}
          outerRadius={80}
          dataKey="value"
          onMouseEnter={({ index }) => setActiveSectorIndex(index)}
          onMouseLeave={() => setActiveSectorIndex(undefined)}
        >
          {data.map((entry, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.type]} />
          ))}
        </Pie>
        <Legend
          content={CustomLegend}
          layout="vertical"
          verticalAlign="middle"
          align="left"
          iconType="circle"
          iconSize={12}
          fontSize={14}
          wrapperStyle={{
            lineHeight: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
