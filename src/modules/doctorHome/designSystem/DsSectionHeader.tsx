import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { dsFocusRing } from '../utils/a11y';
import { ds } from './tokens';

export const DsSectionHeader = ({
  title,
  subtitle,
  href,
  onPress,
  linkLabel = 'همه',
  linkAriaLabel,
  linkIcon,
  onLinkClick,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  onPress?: () => void;
  linkLabel?: string;
  linkAriaLabel?: string;
  linkIcon?: ReactNode;
  onLinkClick?: () => void;
}) => {
  const linkContent = (
    <>
      {linkIcon}
      {linkLabel}
    </>
  );
  const resolvedLinkLabel = linkAriaLabel ?? `${linkLabel} ${title}`;

  return (
    <div className="mb-2.5 flex items-center justify-between gap-4">
      <div>
        <h2 className={ds.type.section}>{title}</h2>
        {subtitle && <p className={classNames(ds.type.caption, 'mt-0.5')}>{subtitle}</p>}
      </div>
      {onPress ? (
        <button
          type="button"
          onClick={onPress}
          aria-label={resolvedLinkLabel}
          className={classNames(ds.type.link, 'inline-flex items-center gap-1', dsFocusRing)}
        >
          {linkContent}
        </button>
      ) : href ? (
        <Link
          href={href}
          onClick={onLinkClick}
          aria-label={resolvedLinkLabel}
          className={classNames(ds.type.link, 'inline-flex items-center gap-1', dsFocusRing)}
        >
          {linkContent}
        </Link>
      ) : null}
    </div>
  );
};
