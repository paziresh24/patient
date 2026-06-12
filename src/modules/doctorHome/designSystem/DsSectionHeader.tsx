import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ds } from './tokens';

export const DsSectionHeader = ({
  title,
  subtitle,
  href,
  onPress,
  linkLabel = 'همه',
  onLinkClick,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  onPress?: () => void;
  linkLabel?: string;
  onLinkClick?: () => void;
}) => (
  <div className="mb-3 flex items-center justify-between gap-4">
    <div>
      <h2 className={ds.type.section}>{title}</h2>
      {subtitle && <p className={classNames(ds.type.caption, 'mt-0.5')}>{subtitle}</p>}
    </div>
    {onPress ? (
      <button type="button" onClick={onPress} className={ds.type.link}>
        {linkLabel}
      </button>
    ) : href ? (
      <Link href={href} onClick={onLinkClick} className={ds.type.link}>
        {linkLabel}
      </Link>
    ) : null}
  </div>
);
