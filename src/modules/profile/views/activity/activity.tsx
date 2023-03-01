import Text from '@/common/components/atom/text/text';
import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';

interface ActivityProps {
  items: {
    text: string;
    icon: ReactNode;
  }[];
  className?: string;
}

export const Activity = (props: ActivityProps) => {
  const { items, className } = props;

  return (
    <div className={classNames('flex flex-col p-4 space-y-2', className)}>
      {items.map(item => (
        <div key={item.text} className="flex items-center p-4 rounded-lg space-s-2 bg-slate-100">
          {item.icon}
          <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>
      ))}
    </div>
  );
};

export default Activity;
