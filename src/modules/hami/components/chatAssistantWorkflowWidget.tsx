import classNames from '@/common/utils/classNames';
import {
  detectTextDirection,
  getTextDirectionClass,
  getVardastBubbleTailClass,
} from '@/common/utils/detectTextDirection';
import {
  parseVardastContent,
  VardastWorkflowMessageItem,
} from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { ChatAssistantAppSource } from '@/modules/hami/components/chatAssistantAppSource';
import {
  ChatAssistantRichContent,
  getRichContentDirection,
} from '@/modules/hami/components/chatAssistantRichContent';
import {
  ChatAssistantWorkflowAttachments,
  isImageAttachment,
} from '@/modules/hami/components/chatAssistantWorkflowAttachments';
import { vardastGlass, vardastType } from '@/modules/hami/components/chatAssistantTypography';
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
  const imageAttachments = (item.attachments ?? []).filter(isImageAttachment);
  const fileAttachments = (item.attachments ?? []).filter(attachment => !isImageAttachment(attachment));
  const contentDirection = body
    ? getRichContentDirection(hasHtmlBody ? body : undefined, !hasHtmlBody ? body : undefined)
    : detectTextDirection(statusTitle);

  return (
    <div
      className={classNames('transition-all duration-300', className, {
        'translate-y-2 opacity-0': !visible,
        'translate-y-0 opacity-100': visible,
      })}
      style={{ transitionDelay: visible ? `${80 + index * 50}ms` : '0ms' }}
    >
      <div
        dir={contentDirection}
        className={classNames(
          'overflow-hidden rounded-2xl p-4',
          getVardastBubbleTailClass(contentDirection),
          getTextDirectionClass(contentDirection),
          vardastGlass.bubble,
        )}
      >
        {item.app?.key && item.app?.name && <ChatAssistantAppSource app={item.app} />}

        {statusTitle && (
          <div className="mb-3 border-b border-white/50 pb-3">
            <p className={vardastType.cardTitle}>{statusTitle}</p>
          </div>
        )}

        <ChatAssistantRichContent
          direction={contentDirection}
          html={hasHtmlBody ? body : undefined}
          plain={!hasHtmlBody ? body : undefined}
        />

        <ChatAssistantWorkflowAttachments
          imageAttachments={imageAttachments}
          fileAttachments={fileAttachments}
        />
      </div>
    </div>
  );
};

export default ChatAssistantWorkflowWidget;
