import { vardastRichContentClass } from '@/modules/hami/components/chatAssistantTypography';

interface ChatAssistantRichContentProps {
  html?: string;
  plain?: string;
}

export const ChatAssistantRichContent = ({ html, plain }: ChatAssistantRichContentProps) => {
  if (!html && !plain) return null;

  return (
    <div className={vardastRichContentClass}>
      {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <p className="whitespace-pre-line">{plain}</p>}
    </div>
  );
};

export default ChatAssistantRichContent;
