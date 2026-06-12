import classNames from '@/common/utils/classNames';
import Link from 'next/link';

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
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
    {href && (
      <Link
        href={href}
        onClick={onSeeAllClick}
        className="shrink-0 text-xs font-medium text-primary"
      >
        مشاهده همه
      </Link>
    )}
  </div>
);
