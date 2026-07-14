import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import CalenderIcon from '@/common/components/icons/calender';
import ChevronIcon from '@/common/components/icons/chevron';
import StatusIcon from '@/common/components/icons/status';
import classNames from '@/common/utils/classNames';
import { addCommas } from '@persian-tools/persian-tools';
import { useEffect, useState } from 'react';

interface MobileBookingBarProps {
  displayName: string;
  hasOnlineVisit: boolean;
  hasPresence: boolean;
  onlineVisitPrice?: number;
  isWebView?: boolean;
  visible?: boolean;
  onOnlineVisit: () => void;
  onPresence: () => void;
}

const OnlineVisitPriceHint = ({ priceLabel }: { priceLabel?: string }) => (
  <div className="flex shrink-0 items-center gap-1.5">
    <Text fontSize="xs" className="whitespace-nowrap text-slate-600">
      ویزیت آنلاین
    </Text>
    {priceLabel && (
      <Text fontSize="xs" fontWeight="bold" className="whitespace-nowrap text-primary">
        از {priceLabel}
      </Text>
    )}
  </div>
);

export const MobileBookingBar = ({
  displayName,
  hasOnlineVisit,
  hasPresence,
  onlineVisitPrice,
  isWebView,
  visible = false,
  onOnlineVisit,
  onPresence,
}: MobileBookingBarProps) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const showDualActions = hasOnlineVisit && hasPresence;
  const priceLabel = onlineVisitPrice ? `${addCommas(onlineVisitPrice / 10)} تومان` : undefined;

  return (
    <div
      role="toolbar"
      aria-label="نوبت‌دهی سریع"
      aria-hidden={!visible}
      className={classNames(
        'pointer-events-none fixed inset-x-0 z-50 border-t border-[#d5d8db] bg-white shadow-[0_-2px_10px_rgba(15,23,42,0.07)] transition-transform duration-300 ease-out',
        isWebView ? 'bottom-0' : 'bottom-16',
        visible && entered ? 'pointer-events-auto translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="space-y-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Text fontSize="xs" className="text-slate-500">
              نوبت‌دهی
            </Text>
            <Text fontWeight="semiBold" fontSize="sm" className="truncate text-slate-800">
              {displayName}
            </Text>
          </div>
          {hasOnlineVisit && <OnlineVisitPriceHint priceLabel={priceLabel} />}
        </div>

        {showDualActions ? (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="primary" className="!h-12" onClick={onOnlineVisit} aria-label="ویزیت آنلاین">
              <span className="flex w-full items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <StatusIcon width={18} height={18} className="shrink-0" aria-hidden />
                  <Text fontSize="sm" fontWeight="semiBold">
                    ویزیت آنلاین
                  </Text>
                </span>
                <ChevronIcon dir="left" className="h-4 w-4 shrink-0 opacity-80" />
              </span>
            </Button>
            <Button variant="secondary" className="!h-12" onClick={onPresence} aria-label="نوبت حضوری">
              <span className="flex w-full items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <CalenderIcon className="h-[18px] w-[18px] shrink-0" isSolid aria-hidden />
                  <Text fontSize="sm" fontWeight="semiBold">
                    نوبت حضوری
                  </Text>
                </span>
                <ChevronIcon dir="left" className="h-4 w-4 shrink-0 opacity-80" />
              </span>
            </Button>
          </div>
        ) : (
          <Button
            block
            variant="primary"
            className="!h-12"
            onClick={hasOnlineVisit ? onOnlineVisit : onPresence}
            aria-label={hasOnlineVisit ? 'شروع ویزیت آنلاین' : 'دریافت نوبت حضوری'}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                {hasOnlineVisit ? (
                  <StatusIcon width={20} height={20} className="shrink-0" aria-hidden />
                ) : (
                  <CalenderIcon className="h-5 w-5 shrink-0" isSolid aria-hidden />
                )}
                <Text fontWeight="semiBold">
                  {hasOnlineVisit ? 'شروع ویزیت آنلاین' : 'دریافت نوبت حضوری'}
                </Text>
              </span>
              <ChevronIcon dir="left" className="shrink-0 opacity-80" />
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileBookingBar;
