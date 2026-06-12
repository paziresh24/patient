import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';

type FeedCardVariant = 'surface' | 'subtle' | 'accent';

interface FeedCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: FeedCardVariant;
}

const variantStyles: Record<FeedCardVariant, string> = {
  surface: 'bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)]',
  subtle: 'bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
  accent: 'bg-gradient-to-br from-white to-slate-50/80 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_6px_20px_rgba(15,23,42,0.05)]',
};

export const FeedCard = ({ children, className, href, onClick, variant = 'surface' }: FeedCardProps) => {
  const card = (
    <div
      className={classNames(
        'rounded-[20px] px-4 py-3.5 transition-all duration-200',
        variantStyles[variant],
        (href || onClick) && 'cursor-pointer active:scale-[0.99] hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]',
        className,
      )}
      onClick={!href ? onClick : undefined}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block">
        {card}
      </Link>
    );
  }

  return card;
};

interface FeedCardHeaderProps {
  icon?: ReactNode;
  label: string;
  meta?: string;
  iconClassName?: string;
  action?: ReactNode;
}

export const FeedCardHeader = ({ icon, label, meta, iconClassName, action }: FeedCardHeaderProps) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex min-w-0 flex-1 items-start gap-3">
      {icon && (
        <div
          className={classNames(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600',
            iconClassName ?? 'bg-slate-100/80',
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-5 text-slate-800">{label}</p>
        {meta && <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500">{meta}</p>}
      </div>
    </div>
    {action}
  </div>
);

export const FeedSectionLabel = ({
  title,
  href,
  onSeeAll,
}: {
  title: string;
  href?: string;
  onSeeAll?: () => void;
}) => (
  <div className="flex items-center justify-between px-0.5 pt-4 pb-1">
    <h3 className="text-[13px] font-semibold tracking-tight text-slate-700">{title}</h3>
    {href && (
      <Link href={href} onClick={onSeeAll} className="text-xs font-medium text-primary/90">
        همه
      </Link>
    )}
  </div>
);
