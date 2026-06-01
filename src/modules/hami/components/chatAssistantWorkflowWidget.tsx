import classNames from '@/common/utils/classNames';
import { parseVardastContent, VardastWorkflowMessageItem } from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { ChatAssistantAppSource } from '@/modules/hami/components/chatAssistantAppSource';
import { ChatAssistantRichContent } from '@/modules/hami/components/chatAssistantRichContent';
import { vardastType } from '@/modules/hami/components/chatAssistantTypography';
import { useMemo } from 'react';

interface ChatAssistantWorkflowWidgetProps {
  item: VardastWorkflowMessageItem;
  visible: boolean;
  index?: number;
  className?: string;
}

export const ChatAssistantWorkflowWidget = ({
  item,
  visible,
  index = 0,
  className,
}: ChatAssistantWorkflowWidgetProps) => {
  const { title, body } = useMemo(() => parseVardastContent(item.content), [item.content]);
  const hasHtmlBody = /<[^>]+>/.test(body);
  const statusTitle = title.trim();

  return (
    <div
      className={classNames('transition-all duration-300', className, {
        'translate-y-2 opacity-0': !visible,
        'translate-y-0 opacity-100': visible,
      })}
      style={{ transitionDelay: visible ? `${80 + index * 50}ms` : '0ms' }}
    >
      <div className="overflow-hidden rounded-xl bg-white p-4 shadow-[0_1px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
        {item.app && <ChatAssistantAppSource app={item.app} />}

        {statusTitle && (
          <div className="mb-3 border-b border-slate-50 pb-3">
            <p className={vardastType.cardTitle}>{statusTitle}</p>
          </div>
        )}

        <ChatAssistantRichContent html={hasHtmlBody ? body : undefined} plain={!hasHtmlBody ? body : undefined} />
      </div>
    </div>
  );
};

export default ChatAssistantWorkflowWidget;
