import Text from '@/common/components/atom/text/text';
import classNames from '@/common/utils/classNames';

interface ProfileHeadRateBadgeProps {
  rate?: string | number | null;
  rateCount?: number | string | null;
  hideRates?: boolean;
  className?: string;
}

export const ProfileHeadRateBadge = ({ rate, rateCount, hideRates, className }: ProfileHeadRateBadgeProps) => {
  if (hideRates) return null;

  const numericRate = Number(rate);
  if (!rate || Number.isNaN(numericRate) || numericRate <= 0) return null;

  const formattedRate = typeof rate === 'string' ? rate : numericRate.toFixed(1);

  return (
    <div className={classNames('flex flex-wrap items-center justify-center gap-2', className)}>
      <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
        <span>{formattedRate}</span>
        <span className="font-medium text-white/90">از ۵</span>
      </span>
      {rateCount != null && Number(rateCount) > 0 && (
        <Text fontSize="sm" fontWeight="medium" className="text-slate-700">
          رضایت ({rateCount} نظر)
        </Text>
      )}
    </div>
  );
};

export default ProfileHeadRateBadge;
