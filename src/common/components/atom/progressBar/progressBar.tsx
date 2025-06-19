import classNames from '@/common/utils/classNames';
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
    <div className={classNames('flex flex-col gap-y-1', parentClassName)}>
      <Text fontSize="sm" fontWeight="medium" className="whitespace-nowrap">
        {title}
      </Text>
      <div className="flex items-center w-full gap-x-3">
        <div className="w-full h-2 bg-[#e9ecef] rounded-2xl">
          <div style={{ width: `${Percent}%` }} className={classNames(`relative h-2 rounded-2xl bg-green-600`, className)}></div>
        </div>
        <Text className="text-end" fontWeight="medium" fontSize="sm">
          {score}
        </Text>
      </div>
    </div>
  );
};

export default ProgressBar;
