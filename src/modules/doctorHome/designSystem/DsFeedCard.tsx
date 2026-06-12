import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ds } from './tokens';

interface DsFeedCardSource {
  icon: ReactNode;
  name: string;
  meta?: string;
}

interface DsFeedCardProps {
  source: DsFeedCardSource;
  action?: ReactNode;
  title?: string;
  children?: ReactNode;
  visual?: ReactNode;
  footer?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const DsFeedCard = ({
  source,
  action,
  title,
  children,
  visual,
  footer,
  href,
  onClick,
  className,
}: DsFeedCardProps) => {
  const card = (
    <article
      className={classNames(
        ds.radius.card,
        ds.surface.card,
        ds.shadow.card,
        'overflow-hidden',
        (href || onClick) && 'cursor-pointer transition-transform active:scale-[0.99]',
        className,
      )}
      onClick={!href ? onClick : undefined}
    >
      <header className="flex items-center gap-3 px-4 pb-1 pt-4">
        <div className={classNames('flex h-9 w-9 shrink-0 items-center justify-center', ds.radius.pill, ds.surface.muted)}>
          {source.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={classNames(ds.type.cardTitle, 'truncate')}>{source.name}</p>
          {source.meta && <p className={classNames(ds.type.caption, 'truncate')}>{source.meta}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>

      {visual && <div className="px-4 pt-3">{visual}</div>}

      <div className="px-4 py-3">
        {title && <h3 className={ds.type.cardTitle}>{title}</h3>}
        {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
      </div>

      {footer && (
        <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          {footer}
        </footer>
      )}
    </article>
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
