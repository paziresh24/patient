import clsx from 'clsx';
import Text from '../text';

interface ProgressBarProps {
  Percent: number | string;
  title: string;
  score?: number;
  parentClassName?: string;
  className?: string;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { Percent, title, score, className, parentClassName } = props;
  return (
    <div className={clsx('flex flex-col gap-y-1', parentClassName)}>
      <Text className="whitespace-nowrap">{title}</Text>
      <div className="flex w-full items-center gap-x-3">
        <div className="w-[90%] h-2 bg-[#e9ecef] rounded-2xl">
          <div style={{ width: `${Percent}%` }} className={clsx(`relative h-2 rounded-2xl bg-green-500`, className)}></div>
        </div>
        <Text className="w-[10%]">{score}</Text>
      </div>
    </div>
  );
};

export default ProgressBar;
