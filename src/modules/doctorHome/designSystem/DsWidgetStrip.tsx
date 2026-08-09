import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ds } from './tokens';

export interface DsWidgetItem {
  icon: ReactNode;
  label: string;
  value: string | number | null;
  subtitle?: string;
  isLoading?: boolean;
  href?: string;
  onClick?: () => void;
  tint?: string;
}

export const DsWidgetStrip = ({ items, className }: { items: DsWidgetItem[]; className?: string }) => (
  <div className={classNames(ds.layout.carouselStrip, className)}>
    {items.map((item, index) => {
      const content = (
        <div
          className={classNames(
            ds.radius.tile,
            ds.shadow.sm,
            'flex h-[5.75rem] w-[7.75rem] shrink-0 snap-start flex-col justify-between border border-slate-100 p-3.5',
            item.tint ?? ds.surface.tile,
            item.href && 'transition-transform active:scale-[0.96]',
          )}
        >
          <span className="text-primary">{item.icon}</span>
          {item.isLoading ? (
            <Skeleton h="1.25rem" w="2.5rem" rounded="md" />
          ) : (
            <div>
              <p className={ds.type.insightValue}>{item.value ?? '—'}</p>
              <p className={classNames(ds.type.caption, 'mt-1 truncate')}>{item.label}</p>
            </div>
          )}
        </div>
      );

      if (item.href) {
        return (
          <Link key={index} href={item.href} onClick={item.onClick} className="shrink-0">
            {content}
          </Link>
        );
      }

      return <div key={index} className="shrink-0">{content}</div>;
    })}
  </div>
);
