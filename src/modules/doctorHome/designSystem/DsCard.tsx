import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { KeyboardEvent, ReactNode } from 'react';
import { ds } from './tokens';
import { dsFocusRing } from '../utils/a11y';

interface DsCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  variant?: 'default' | 'widget';
  ariaLabel?: string;
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
  ariaLabel,
}: DsCardProps) => {
  const isInteractive = interactive ?? !!(href || onClick);
  const isWidget = variant === 'widget';

  const onKeyDown =
    !href && onClick
      ? (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          onClick();
        }
      : undefined;

  const card = (
    <div
      className={classNames(
        isWidget ? ds.workstation.widget : classNames(ds.radius.card, ds.surface.card, ds.shadow.sm),
        isInteractive && classNames('cursor-pointer', ds.motion.surface, ds.motion.press, 'hover:shadow-md', dsFocusRing),
        paddingMap[padding],
        className,
      )}
      role={isInteractive && !href ? 'button' : undefined}
      tabIndex={isInteractive && !href ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={!href ? onClick : undefined}
      onKeyDown={onKeyDown}
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
