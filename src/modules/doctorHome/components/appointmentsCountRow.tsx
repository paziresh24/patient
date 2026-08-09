import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import { ds } from '../designSystem';
import { FeedContentSwap } from './feedContentSwap';
import { dsFocusRing } from '../utils/a11y';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { CalendarIcon } from './icons';

interface AppointmentsCountRowProps {
  title: string;
  count: number | null;
  isLoading?: boolean;
  userId?: string;
  onPress: () => void;
  trailing?: ReactNode;
  className?: string;
  widgetShell?: boolean;
}

export const AppointmentsCountRow = ({
  title,
  count,
  isLoading,
  userId,
  onPress,
  trailing,
  className,
  widgetShell = false,
}: AppointmentsCountRowProps) => {
  const countLabel = count != null ? `${count.toLocaleString('fa-IR')} نوبت` : null;
  const rowAriaLabel = countLabel
    ? `مشاهده همه نوبت‌ها، ${countLabel}`
    : 'مشاهده همه نوبت‌ها';

  return (
    <div className={classNames('flex items-center gap-2', widgetShell ? 'px-5 py-4' : ds.layout.rowPadding, className)}>
      <button
        type="button"
        aria-label={rowAriaLabel}
        onClick={() => {
          sendDoctorHomeEvent(userId, 'stat_appointments', { count });
          onPress();
        }}
        className={classNames('flex min-w-0 flex-1 items-center gap-3 text-start', ds.motion.listRow, dsFocusRing)}
      >
        <span
          className={classNames(
            'h-10 w-10',
            ds.icon.containerAction,
            ds.radius.inner,
          )}
        >
          <CalendarIcon size="md" />
        </span>

        <span className="min-w-0 flex-1">
          <p className={ds.type.cardTitle}>{title}</p>
          {isLoading ? (
            <Skeleton h="0.75rem" w="3rem" rounded="full" className="mt-0.5" />
          ) : countLabel ? (
            <FeedContentSwap swapKey={countLabel} variant="pop">
              <p className={classNames(ds.type.caption, 'mt-0.5')}>{countLabel}</p>
            </FeedContentSwap>
          ) : (
            <p className={classNames(ds.type.caption, 'mt-0.5')}>—</p>
          )}
        </span>
      </button>
      {trailing}
    </div>
  );
};
