import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ds } from '../designSystem/tokens';

interface SectionHeaderProps {
  title: string;
  href?: string;
  onSeeAllClick?: () => void;
  subtitle?: string;
  className?: string;
}

export const SectionHeader = ({ title, href, onSeeAllClick, subtitle, className }: SectionHeaderProps) => (
  <div className={classNames('mb-3 flex items-start justify-between gap-2', className)}>
    <div>
      <h3 className={ds.type.section}>{title}</h3>
      {subtitle && <p className={classNames(ds.type.caption, 'mt-0.5')}>{subtitle}</p>}
    </div>
    {href && (
      <Link href={href} onClick={onSeeAllClick} className={classNames(ds.type.link, 'shrink-0')}>
        مشاهده همه
      </Link>
    )}
  </div>
);
