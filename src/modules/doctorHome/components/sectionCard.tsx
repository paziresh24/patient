import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({ children, className }: SectionCardProps) => (
  <div className={classNames('rounded-2xl bg-white p-4 shadow-sm border border-slate-100', className)}>{children}</div>
);
