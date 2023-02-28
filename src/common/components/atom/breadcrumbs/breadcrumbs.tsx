import clsx from 'clsx';
import { useState } from 'react';
import { BreadcrumbItem } from './item';

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    text: string;
    href: string;
  }>;
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { items = [], className, ...rest } = props;
  const [hoverItem, setIsHoverItem] = useState<number | null>(null);

  return (
    <div className={clsx('flex items-center overflow-auto no-scroll', className)} {...rest}>
      {items?.map((item, index) => (
        <BreadcrumbItem
          key={index}
          href={item.href}
          text={item.text}
          showChevron={items.length !== index + 1}
          onMouseOver={() => setIsHoverItem(index)}
          onMouseLeave={() => setIsHoverItem(null)}
          chevronDir={hoverItem !== null ? (hoverItem > index ? 'left' : 'right') : 'left'}
          className={clsx('min-w-fit', { 'opacity-80': items.length === index + 1 })}
        />
      ))}
    </div>
  );
};

export default Breadcrumbs;
