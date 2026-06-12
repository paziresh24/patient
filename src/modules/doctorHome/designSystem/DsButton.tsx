import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';

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
  secondary: 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200',
  ghost: 'border border-primary/40 text-primary hover:bg-primary/5',
  text: 'text-primary hover:bg-primary/5 bg-transparent',
};

const base = 'inline-flex items-center justify-center rounded-lg px-3 h-10 min-h-[2.5rem] text-xs font-bold transition-all';

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
