import ChatIcon from '@/common/components/icons/chat';
import SparkleIcon from '@/common/components/icons/sparkle';
import classNames from '@/common/utils/classNames';
import { VARDAST_NAME, vardastType } from '@/modules/hami/components/chatAssistantTypography';

interface ChatAssistantUnsupportedProps {
  visible?: boolean;
}

export const ChatAssistantUnsupported = ({ visible = true }: ChatAssistantUnsupportedProps) => (
  <div
    className={classNames(
      'relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-slate-50 p-5 text-right shadow-[0_4px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 transition-all duration-300',
      {
        'translate-y-2 opacity-0': !visible,
        'translate-y-0 opacity-100': visible,
      },
    )}
  >
    <div
      className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#6B8AFF]/10 blur-2xl"
      aria-hidden
    />

    <div className="relative flex items-start gap-3">
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 ring-1 ring-slate-200/60">
          <ChatIcon className="h-6 w-6 text-slate-400" />
        </div>
        <div className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
          <SparkleIcon className="h-3.5 w-3.5 text-slate-300" />
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/50">
          فعلاً در دسترس نیست
        </span>
        <p className={vardastType.cardTitle}>وردست این گفت‌وگو را پوشش نمی‌دهد</p>
        <p className={vardastType.body}>
          الان {VARDAST_NAME} برای این چت فعال نیست؛ می‌توانید مثل همیشه از بخش گفت‌وگو با بیمار ادامه دهید.
        </p>
      </div>
    </div>
  </div>
);

export default ChatAssistantUnsupported;
