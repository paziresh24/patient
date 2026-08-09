import SparkleIcon from '@/common/components/icons/sparkle';
import classNames from '@/common/utils/classNames';
import { getTextDirectionClass, type TextDirection } from '@/common/utils/detectTextDirection';
import { ReactNode } from 'react';

export interface ChatAssistantMessageAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary';
}

interface ChatAssistantMessageProps {
  header?: ReactNode;
  visible?: boolean;
  index?: number;
  wide?: boolean;
  accent?: boolean;
  direction?: TextDirection;
  actions?: ChatAssistantMessageAction[];
  onActionClick?: (action: ChatAssistantMessageAction) => void;
  children: ReactNode;
}

export const ChatAssistantMessage = ({
  header,
  visible = true,
  index = 0,
  wide = false,
  accent = false,
  direction = 'rtl',
  actions,
  onActionClick,
  children,
}: ChatAssistantMessageProps) => (
  <div
    className={classNames('mr-auto w-full transition-all duration-500 ease-out', wide ? 'max-w-full' : 'max-w-[94%]', {
      'translate-y-2 opacity-0': !visible,
      'translate-y-0 opacity-100': visible,
    })}
    style={{ transitionDelay: visible ? `${index * 40}ms` : '0ms' }}
  >
    <div
      dir={direction}
      className={classNames(
        'relative overflow-hidden rounded-[18px] bg-white px-4 py-3.5 shadow-[0_4px_24px_-6px_rgba(56,97,251,0.14)] ring-1 ring-slate-900/[0.05]',
        getTextDirectionClass(direction),
        accent && 'bg-gradient-to-br from-white via-white to-primary/[0.03]',
      )}
    >
      {accent && (
        <div className="absolute inset-y-3 start-0 w-[3px] rounded-full bg-gradient-to-b from-primary via-[#6B8AFF] to-violet-400" />
      )}

      {header && <div className="mb-2.5 ps-1">{header}</div>}
      <div className="ps-1">{children}</div>

      {!!actions?.length && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 ps-1">
          {actions.map(action => (
            <button
              key={action.id}
              type="button"
              onClick={() => onActionClick?.(action)}
              className={classNames(
                'w-full rounded-xl px-3 py-2.5 text-xs font-medium transition active:scale-[0.99]',
                action.variant === 'primary'
                  ? 'bg-gradient-to-r from-primary to-[#5B7FEB] text-white shadow-sm shadow-primary/25'
                  : 'bg-slate-50 text-slate-700 ring-1 ring-slate-100',
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const ChatAssistantAiBadge = () => (
  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/[0.08] px-2 py-0.5 text-[10px] font-medium text-primary">
    <SparkleIcon className="h-3 w-3" />
    تحلیل هوشمند
  </span>
);

export default ChatAssistantMessage;
