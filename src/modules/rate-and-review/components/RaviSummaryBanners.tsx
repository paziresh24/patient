import { InfoIcon } from '@/common/components/icons/info';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

const LOW_REVIEW_COUNT_MESSAGE = 'به دلیل تعداد کم نظرات، امتیاز قابل نمایش نیست.';
const LOW_REVIEW_COUNT_HINT = 'برای نمایش امتیاز پزشک حداقل 5 نظر لازم است ثبت شده باشد.';
export const DOCTOR_HIDE_RATES_MESSAGE = 'به درخواست پزشک، مشاهده بخش نظرات امکان پذیر نمی باشد.';

const LucideInfoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4m0-4h.01" />
  </svg>
);

/** Plasmic NoReview — slate pill with info popover */
export const RaviLowReviewCountBanner = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex max-w-full flex-row items-center justify-center rounded-[1.75rem] border border-[#94a3b8] bg-[#f1f5f9]">
        <p className="px-[3px] pr-[10px] text-center text-sm font-medium text-[#64748b]">{LOW_REVIEW_COUNT_MESSAGE}</p>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="ml-[7px] flex shrink-0 cursor-pointer items-center text-[#64748b]"
              aria-label="توضیح حداقل تعداد نظرات"
              onClick={event => event.stopPropagation()}
            >
              <LucideInfoIcon className="h-4 w-4" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-50 w-[300px] rounded-lg border border-[#e2e8f0] bg-white p-3 text-right text-sm shadow-[0px_4px_16px_0px_#00000033]"
              sideOffset={4}
              onClick={event => event.stopPropagation()}
            >
              {LOW_REVIEW_COUNT_HINT}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
};

/** Plasmic RaviAlert — yellow doctor-hide banner */
export const RaviDoctorHideRatesBanner = () => (
  <div className="flex w-full flex-col items-center">
    <div
      className="flex w-full max-w-full flex-row items-center justify-end gap-2 rounded-xl border border-[#475569] bg-[#fac52226] p-2"
      dir="rtl"
    >
      <p className="min-w-0 flex-1 text-right text-sm font-medium">{DOCTOR_HIDE_RATES_MESSAGE}</p>
      <InfoIcon className="h-[30px] w-[30px] shrink-0" />
    </div>
  </div>
);
