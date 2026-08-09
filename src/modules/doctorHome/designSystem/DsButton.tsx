import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { dsFocusRing } from '../utils/a11y';
import { ds } from './tokens';

type DsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text';

interface DsButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: DsButtonVariant;
  className?: string;
}

const variants: Record<DsButtonVariant, string> = {
  primary: 'bg-primary border border-primary text-white hover:bg-primary/90',
  secondary: classNames(ds.surface.muted, 'border border-slate-200 text-slate-700 hover:bg-slate-200'),
  ghost: 'border border-primary/40 text-primary hover:bg-primary/5',
  text: classNames(ds.type.link, 'hover:bg-primary/5 bg-transparent'),
};

const base = classNames(
  'inline-flex items-center justify-center px-3 h-10 min-h-[2.5rem]',
  ds.motion.surface,
  ds.motion.press,
  ds.radius.inner,
  ds.type.button,
  dsFocusRing,
);

export const DsButton = ({ children, href, onClick, variant = 'primary', className }: DsButtonProps) => {
  const classes = classNames(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
};
