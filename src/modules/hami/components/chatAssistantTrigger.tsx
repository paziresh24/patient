import SparkleIcon from '@/common/components/icons/sparkle';
import classNames from '@/common/utils/classNames';
import { VARDAST_NAME } from '@/modules/hami/components/chatAssistantTypography';
import { PointerEvent, TouchEvent } from 'react';

interface ChatAssistantTriggerProps {
  hidden?: boolean;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLButtonElement>) => void;
  onOpen: () => void;
}

/** تب لبه راست — هم‌جهت با کشوی وردست */
export const ChatAssistantTrigger = ({ hidden, onPointerDown, onTouchStart, onOpen }: ChatAssistantTriggerProps) => (
  <button
    type="button"
    aria-label={`باز کردن ${VARDAST_NAME}`}
    className={classNames(
      'absolute top-1/2 z-40 flex -translate-y-1/2 touch-manipulation items-center justify-end py-8 pl-5 pr-0 transition-opacity duration-300 right-0',
      hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
    )}
    onPointerDown={onPointerDown}
    onTouchStart={onTouchStart}
    onClick={onOpen}
  >
    <span className="vardast-trigger-tab relative flex w-[40px] cursor-grab flex-col items-center gap-2 rounded-l-2xl border border-r-0 border-primary/20 bg-gradient-to-b from-primary/5 to-white py-4 shadow-[-4px_0_20px_rgba(99,102,241,0.15)] transition-transform active:scale-[0.97] active:cursor-grabbing md:hover:-translate-x-0.5">
      <span className="absolute inset-y-3 right-0 w-0.5 rounded-full bg-primary" aria-hidden />
      <SparkleIcon className="vardast-trigger-sparkle h-4 w-4 text-primary" />
      <span className="text-[13px] font-bold text-primary [writing-mode:vertical-rl]">{VARDAST_NAME}</span>
    </span>
  </button>
);

export default ChatAssistantTrigger;
