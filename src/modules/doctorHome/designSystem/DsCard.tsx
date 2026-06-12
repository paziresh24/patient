import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ds } from './tokens';

interface DsCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  padding?: 'none' | 'md' | 'lg';
  interactive?: boolean;
}

const paddingMap = {
  none: '',
  md: 'p-4',
  lg: 'p-5',
};

export const DsCard = ({
  children,
  className,
  href,
  onClick,
  padding = 'lg',
  interactive,
}: DsCardProps) => {
  const isInteractive = interactive ?? !!(href || onClick);

  const card = (
    <div
      className={classNames(
        ds.radius.card,
        ds.surface.card,
        ds.shadow.sm,
        isInteractive && 'cursor-pointer transition-transform active:scale-[0.99]',
        paddingMap[padding],
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
