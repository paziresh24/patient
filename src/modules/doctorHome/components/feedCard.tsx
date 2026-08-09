import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ds } from '../designSystem/tokens';

type FeedCardVariant = 'surface' | 'subtle' | 'accent';

interface FeedCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: FeedCardVariant;
}

const variantStyles: Record<FeedCardVariant, string> = {
  surface: classNames(ds.surface.card, ds.shadow.card),
  subtle: classNames(ds.surface.feedCardSubtle, ds.shadow.sm),
  accent: classNames(ds.surface.feedCardAccent, ds.shadow.card),
};

export const FeedCard = ({ children, className, href, onClick, variant = 'surface' }: FeedCardProps) => {
  const card = (
    <div
      className={classNames(
        ds.radius.card,
        ds.layout.feedCardBody,
        variantStyles[variant],
        (href || onClick) && 'cursor-pointer transition-all duration-200 active:scale-[0.99] hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]',
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
  <div className={classNames('flex items-start justify-between', ds.layout.listRowGap)}>
    <div className={classNames('flex min-w-0 flex-1 items-start', ds.layout.listRowGap)}>
      {icon && (
        <div
          className={classNames(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600',
            iconClassName ?? ds.surface.iconCircle,
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className={ds.type.cardTitleSemibold}>{label}</p>
        {meta && <p className={classNames(ds.type.caption, 'mt-0.5 line-clamp-2 leading-5')}>{meta}</p>}
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
    <h3 className={ds.type.subsection}>{title}</h3>
    {href && (
      <Link href={href} onClick={onSeeAll} className={ds.type.link}>
        همه
      </Link>
    )}
  </div>
);
