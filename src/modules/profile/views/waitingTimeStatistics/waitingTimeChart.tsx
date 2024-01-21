import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = ['rgba(57, 146, 61, 1)', 'rgba(58, 180, 64, 1)', 'rgba(255, 173, 13, 1)', 'rgba(240, 115, 0, 1)'];

interface Label {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

interface Data {
  waiting_time: number;
  waiting_time_title: string;
  waiting_time_count: number;
  waiting_time_percent: number;
  name: string;
  value: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props: Label) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 6) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-semibold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return payload.map((item: any) => (
    <div className="flex items-center gap-3" key={item.value}>
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
      <div className="flex gap-1">
        <p className="text-xs font-semibold">{item.payload.value}%</p>
        <p className="text-xs">{item.value}</p>
      </div>
    </div>
  ));
};

export default function WaitingRechart({ data }: { data: Data[] }) {
  return (
    <ResponsiveContainer width={300} height={120}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={60} fill="#8884d8" dataKey="value">
          {data.map((entry, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.waiting_time]} />
          ))}
        </Pie>
        <Legend
          content={renderCustomLegend}
          layout="vertical"
          verticalAlign="middle"
          align="left"
          iconType="circle"
          iconSize={12}
          fontSize={12}
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
