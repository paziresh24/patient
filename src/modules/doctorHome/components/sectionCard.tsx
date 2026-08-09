import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import { ds } from '../designSystem/tokens';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({ children, className }: SectionCardProps) => (
  <div className={classNames(ds.radius.card, ds.surface.card, ds.shadow.sm, ds.layout.sectionCardPadding, className)}>
    {children}
  </div>
);
