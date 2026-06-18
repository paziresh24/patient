import ChatIcon from '@/common/components/icons/chat';
import SparkleIcon from '@/common/components/icons/sparkle';
import classNames from '@/common/utils/classNames';
import { VARDAST_NAME, vardastGlass, vardastType } from '@/modules/hami/components/chatAssistantTypography';

interface ChatAssistantUnsupportedProps {
  visible?: boolean;
}

export const ChatAssistantUnsupported = ({ visible = true }: ChatAssistantUnsupportedProps) => (
  <div
    className={classNames(
      'rounded-2xl rounded-br-md p-4 text-right transition-all duration-300',
      vardastGlass.bubble,
      {
        'translate-y-2 opacity-0': !visible,
        'translate-y-0 opacity-100': visible,
      },
    )}
  >
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/55 ring-1 ring-white/70 backdrop-blur-sm">
          <ChatIcon className="h-5 w-5 text-slate-400" />
        </div>
        <div className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-white/80 backdrop-blur-sm">
          <SparkleIcon className="h-3 w-3 text-slate-300" />
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <span className={classNames('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium text-slate-600', vardastGlass.badge)}>
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
