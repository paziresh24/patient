import Text from '@/common/components/atom/text/text';
import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';

interface CenterSectionTitleProps {
  title: string;
  icon?: ReactNode;
  className?: string;
}

export const CenterSectionTitle = ({ title, icon, className }: CenterSectionTitleProps) => (
  <div className={classNames('flex items-center gap-3 px-4 md:px-0', className)}>
    {icon && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>}
    <Text fontWeight="bold" className="shrink-0 text-base md:text-lg">
      {title}
    </Text>
    <div className="hidden h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-100 sm:block" />
  </div>
);

export default CenterSectionTitle;
