import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ds } from '../designSystem/tokens';

interface StatCardProps {
  label: string;
  value: string | number | null;
  subtitle?: string;
  isLoading?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const StatCard = ({ label, value, subtitle, isLoading, href, onClick, className }: StatCardProps) => {
  const content = (
    <div
      className={classNames(
        'flex min-w-[7.5rem] flex-col gap-1',
        ds.radius.tile,
        ds.surface.card,
        ds.shadow.sm,
        ds.layout.cardInset,
        href && 'cursor-pointer transition-shadow hover:shadow-md',
        className,
      )}
      onClick={!href ? onClick : undefined}
    >
      <span className={ds.type.label}>{label}</span>
      {isLoading ? (
        <Skeleton h="1.25rem" w="3rem" rounded="full" />
      ) : (
        <>
          <span className={ds.type.count}>{value ?? '—'}</span>
          {subtitle && <span className={ds.type.captionSm}>{subtitle}</span>}
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};
