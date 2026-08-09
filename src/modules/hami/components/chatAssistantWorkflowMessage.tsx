import classNames from '@/common/utils/classNames';
import { parseVardastContent, VardastWorkflowMessageItem } from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { ChatAssistantMessage } from '@/modules/hami/components/chatAssistantMessage';
import {
  ChatAssistantRichContent,
  getRichContentDirection,
} from '@/modules/hami/components/chatAssistantRichContent';
import { useMemo } from 'react';

interface ChatAssistantWorkflowMessageProps {
  item: VardastWorkflowMessageItem;
  visible: boolean;
  index?: number;
}

const cleanStatusTitle = (title: string) =>
  title
    .replace(/[\u{1F534}\u{1F7E2}\u{1F7E1}\u{1F7E0}\u26AA\u26AB\u{1F535}\u{1F7E3}\u{1F7E4}⚪🟢🟡🔴🟠🟣]/gu, '')
    .trim();

const getStatusStyle = (title: string) => {
  if (/🟢|تکمیل|انجام/.test(title)) {
    return { pill: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20', dot: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' };
  }
  if (/🟡|در حال|ناتمام|نیمه/.test(title)) {
    return { pill: 'bg-amber-500/10 text-amber-700 ring-amber-500/20', dot: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]' };
  }
  if (/🔴|رد|خطا|ناموفق|وارد نشده/.test(title)) {
    return { pill: 'bg-rose-500/10 text-rose-700 ring-rose-500/20', dot: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]' };
  }
  return { pill: 'bg-slate-500/10 text-slate-600 ring-slate-500/15', dot: 'bg-slate-400' };
};

export const ChatAssistantWorkflowMessage = ({
  item,
  visible,
  index = 0,
}: ChatAssistantWorkflowMessageProps) => {
  const { title, body } = useMemo(() => parseVardastContent(item.content), [item.content]);
  const hasHtmlBody = /<[^>]+>/.test(body);
  const statusTitle = title ? cleanStatusTitle(title) : '';
  const statusStyle = title ? getStatusStyle(title) : null;
  const isLongContent = body.length > 280 || (hasHtmlBody && body.length > 120);
  const contentDirection = getRichContentDirection(hasHtmlBody ? body : undefined, !hasHtmlBody ? body : undefined);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {item.app && (
        <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-900/[0.04]">
          <img src={item.app.icon} alt={item.app.name} className="h-5 w-5 rounded-md object-cover" />
          <span className="text-xs font-medium text-slate-800">{item.app.name}</span>
        </div>
      )}
      {statusTitle && statusStyle && (
        <span className={classNames('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1', statusStyle.pill)}>
          <span className={classNames('h-1.5 w-1.5 rounded-full', statusStyle.dot)} />
          {statusTitle}
        </span>
      )}
    </div>
  );

  return (
    <ChatAssistantMessage
      header={header}
      visible={visible}
      index={index}
      wide={isLongContent}
      direction={contentDirection}
    >
      <ChatAssistantRichContent
        direction={contentDirection}
        html={hasHtmlBody ? body : undefined}
        plain={!hasHtmlBody ? body : undefined}
      />
    </ChatAssistantMessage>
  );
};

export default ChatAssistantWorkflowMessage;
