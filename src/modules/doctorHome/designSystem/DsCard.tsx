import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ds } from './tokens';

interface DsCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  variant?: 'default' | 'widget';
}

const paddingMap = {
  none: '',
  sm: 'p-3',
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
  variant = 'default',
}: DsCardProps) => {
  const isInteractive = interactive ?? !!(href || onClick);
  const isWidget = variant === 'widget';

  const card = (
    <div
      className={classNames(
        isWidget ? ds.workstation.widget : classNames(ds.radius.card, ds.surface.card, ds.shadow.sm),
        isInteractive && classNames('cursor-pointer', ds.motion.surface, ds.motion.press, 'hover:shadow-md'),
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
