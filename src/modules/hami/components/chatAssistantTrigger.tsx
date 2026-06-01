import SparkleIcon from '@/common/components/icons/sparkle';
import classNames from '@/common/utils/classNames';
import { VARDAST_NAME } from '@/modules/hami/components/chatAssistantTypography';
import { PointerEvent, TouchEvent } from 'react';

interface ChatAssistantTriggerProps {
  hidden?: boolean;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLButtonElement>) => void;
}

/** تب لبه راست — هم‌جهت با کشوی وردست */
export const ChatAssistantTrigger = ({ hidden, onPointerDown, onTouchStart }: ChatAssistantTriggerProps) => (
  <button
    type="button"
    aria-label={`باز کردن ${VARDAST_NAME}`}
    className={classNames(
      'absolute top-1/2 z-40 flex -translate-y-1/2 touch-none items-center justify-end py-8 pl-5 pr-0 transition-opacity duration-300 right-0',
      hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
    )}
    onPointerDown={onPointerDown}
    onTouchStart={onTouchStart}
  >
    <span className="vardast-trigger-tab relative flex w-[34px] cursor-grab flex-col items-center gap-1.5 rounded-l-xl border border-r-0 border-slate-200/90 bg-white py-2.5 shadow-[-4px_0_16px_rgba(15,23,42,0.1)] transition-transform active:scale-[0.97] active:cursor-grabbing md:hover:-translate-x-0.5">
      <span className="absolute inset-y-2 right-0 w-0.5 rounded-full bg-primary" aria-hidden />
      <SparkleIcon className="vardast-trigger-sparkle h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] font-semibold text-slate-700 [writing-mode:vertical-rl]">{VARDAST_NAME}</span>
    </span>
  </button>
);

export default ChatAssistantTrigger;
