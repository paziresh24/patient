import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ds } from './tokens';

export interface DsMetricItem {
  label: string;
  value: string | number | null;
  subtitle?: string;
  isLoading?: boolean;
  href?: string;
  onClick?: () => void;
  tint?: string;
}

export const DsMetricGrid = ({ items, className }: { items: DsMetricItem[]; className?: string }) => (
  <div className={classNames('grid grid-cols-2 gap-3', className)}>
    {items.map((item, index) => {
      const content = (
        <div
          className={classNames(
            ds.radius.tile,
            ds.shadow.sm,
            'flex min-h-[6.25rem] flex-col justify-between border border-slate-100 p-4',
            item.tint ?? 'bg-white',
            item.href && 'transition-transform active:scale-[0.97]',
          )}
        >
          <span className={ds.type.label}>{item.label}</span>
          {item.isLoading ? (
            <Skeleton h="1.5rem" w="3.5rem" rounded="md" className="mt-3" />
          ) : (
            <div className="mt-3">
              <p className={ds.type.metric}>{item.value ?? '—'}</p>
              {item.subtitle && <p className={classNames(ds.type.caption, 'mt-1.5')}>{item.subtitle}</p>}
            </div>
          )}
        </div>
      );

      if (item.href) {
        return (
          <Link key={index} href={item.href} onClick={item.onClick} className="block">
            {content}
          </Link>
        );
      }

      return <div key={index}>{content}</div>;
    })}
  </div>
);
