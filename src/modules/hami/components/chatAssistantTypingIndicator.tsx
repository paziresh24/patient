import classNames from '@/common/utils/classNames';
import { vardastGlass, vardastType } from '@/modules/hami/components/chatAssistantTypography';

export const ChatAssistantTypingIndicator = ({ visible = true }: { visible?: boolean }) => (
  <div className={classNames('transition-opacity', visible ? 'opacity-100' : 'opacity-0')}>
    <div className={classNames('rounded-2xl rounded-br-md px-4 py-3.5', vardastGlass.bubble)}>
      <div className="flex items-center gap-2.5">
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
        </span>
        <p className={vardastType.caption}>در حال بررسی...</p>
      </div>
    </div>
  </div>
);

export default ChatAssistantTypingIndicator;
