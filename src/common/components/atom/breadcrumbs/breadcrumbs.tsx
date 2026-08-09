import classNames from '@/common/utils/classNames';
import { useState } from 'react';
import { BreadcrumbItem } from './item';

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    text: string;
    href?: string;
  }>;
  dir?: 'rtl' | 'ltr';
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { items = [], className, dir = 'rtl', ...rest } = props;
  const [hoverItem, setIsHoverItem] = useState<number | null>(null);
  const defaultChevron = dir === 'ltr' ? 'right' : 'left';

  const getChevronDir = (index: number): 'left' | 'right' => {
    if (hoverItem === null) return defaultChevron;
    const isBeforeHover = hoverItem > index;
    if (dir === 'ltr') return isBeforeHover ? 'right' : 'left';
    return isBeforeHover ? 'left' : 'right';
  };

  return (
    <div dir={dir} className={classNames('flex items-center overflow-auto no-scroll', className)} {...rest}>
      {items?.map((item, index) => (
        <BreadcrumbItem
          key={index}
          href={item.href}
          text={item.text}
          showChevron={items.length !== index + 1}
          onMouseOver={() => setIsHoverItem(index)}
          onMouseLeave={() => setIsHoverItem(null)}
          chevronDir={getChevronDir(index)}
          className={classNames('min-w-fit w-max', { 'opacity-80': items.length === index + 1 })}
        />
      ))}
    </div>
  );
};

export default Breadcrumbs;
