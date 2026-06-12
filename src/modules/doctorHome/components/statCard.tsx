import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';

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
        'flex min-w-[7.5rem] flex-col gap-1 rounded-xl border border-slate-100 bg-white p-3 shadow-sm',
        href && 'cursor-pointer transition-shadow hover:shadow-md',
        className,
      )}
      onClick={!href ? onClick : undefined}
    >
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
      {isLoading ? (
        <Skeleton h="1.25rem" w="3rem" rounded="full" />
      ) : (
        <>
          <span className="text-base font-bold text-slate-900">{value ?? '—'}</span>
          {subtitle && <span className="text-[10px] font-medium text-slate-500">{subtitle}</span>}
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
