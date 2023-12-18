import classNames from '@/common/utils/classNames';
import { Item, ItemProps } from './item';

interface ActivityProps {
  items: ItemProps[];
  className?: string;
}

export const Activity = (props: ActivityProps) => {
  const { items, className } = props;

  return (
    <div className={classNames('flex flex-col p-4 space-y-2', className)}>
      {items.map((item, index) => (
        <Item key={index} {...item} />
      ))}
    </div>
  );
};

export default Activity;
