import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import CalenderIcon from '@/common/components/icons/calender';
import ChatIcon from '@/common/components/icons/chat';
import ChevronIcon from '@/common/components/icons/chevron';
import classNames from '@/common/utils/classNames';
import { addCommas } from '@persian-tools/persian-tools';

interface MobileBookingBarProps {
  displayName: string;
  hasOnlineVisit: boolean;
  hasPresence: boolean;
  onlineVisitPrice?: number;
  isWebView?: boolean;
  onOnlineVisit: () => void;
  onPresence: () => void;
}

export const MobileBookingBar = ({
  displayName,
  hasOnlineVisit,
  hasPresence,
  onlineVisitPrice,
  isWebView,
  onOnlineVisit,
  onPresence,
}: MobileBookingBarProps) => {
  const showDualActions = hasOnlineVisit && hasPresence;
  const priceLabel = onlineVisitPrice ? `${addCommas(onlineVisitPrice / 10)} تومان` : undefined;

  return (
    <div
      className={classNames(
        'fixed inset-x-0 z-50 border-t border-slate-200/90 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md',
        isWebView ? 'bottom-0' : 'bottom-16',
      )}
    >
      <div className="space-y-2.5 px-3 pb-3 pt-2.5">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div className="min-w-0">
            <Text fontSize="xs" className="text-slate-500">
              نوبت‌دهی
            </Text>
            <Text fontWeight="semiBold" fontSize="sm" className="truncate text-slate-800">
              {displayName}
            </Text>
          </div>
          {hasOnlineVisit && priceLabel && (
            <div className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1">
              <Text fontSize="xs" fontWeight="semiBold" className="text-primary">
                ویزیت آنلاین از {priceLabel}
              </Text>
            </div>
          )}
        </div>

        {showDualActions ? (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="primary" className="!h-11 !px-2" onClick={onOnlineVisit}>
              <span className="flex w-full items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <ChatIcon width={18} height={18} />
                  <Text fontSize="sm" fontWeight="semiBold">
                    ویزیت آنلاین
                  </Text>
                </span>
                <ChevronIcon dir="left" className="h-4 w-4 shrink-0 opacity-80" />
              </span>
            </Button>
            <Button variant="secondary" className="!h-11 !px-2" onClick={onPresence}>
              <span className="flex w-full items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <CalenderIcon className="h-[18px] w-[18px]" isSolid />
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
          >
            <span className="flex w-full items-center justify-between">
              <span className="flex items-center gap-2">
                {hasOnlineVisit ? <ChatIcon width={20} height={20} /> : <CalenderIcon className="h-5 w-5" isSolid />}
                <span className="flex flex-col items-start leading-tight">
                  <Text fontWeight="semiBold">
                    {hasOnlineVisit ? 'شروع ویزیت آنلاین' : 'دریافت نوبت حضوری'}
                  </Text>
                  {hasOnlineVisit && priceLabel && (
                    <Text fontSize="xs" className="opacity-90">
                      {priceLabel}
                    </Text>
                  )}
                </span>
              </span>
              <ChevronIcon dir="left" />
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileBookingBar;
