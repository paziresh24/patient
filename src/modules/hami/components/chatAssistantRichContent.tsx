import { vardastRichContentClass } from '@/modules/hami/components/chatAssistantTypography';
import classNames from '@/common/utils/classNames';
import {
  detectContentDirection,
  getTextDirectionClass,
  type TextDirection,
} from '@/common/utils/detectTextDirection';

interface ChatAssistantRichContentProps {
  html?: string;
  plain?: string;
  direction?: TextDirection;
}

export const getRichContentDirection = (html?: string, plain?: string) =>
  detectContentDirection({ html, plain });

export const ChatAssistantRichContent = ({ html, plain, direction }: ChatAssistantRichContentProps) => {
  if (!html && !plain) return null;

  const resolvedDirection = direction ?? getRichContentDirection(html, plain);

  if (html) {
    return (
      <div
        dir={resolvedDirection}
        className={classNames(vardastRichContentClass, getTextDirectionClass(resolvedDirection))}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const lines = plain!.split('\n');

  return (
    <div
      dir={resolvedDirection}
      className={classNames(vardastRichContentClass, getTextDirectionClass(resolvedDirection))}
    >
      {lines.map((line, index) => (
        <p key={index} className={classNames('whitespace-pre-wrap', index > 0 && 'mt-2.5')}>
          {line || '\u00A0'}
        </p>
      ))}
    </div>
  );
};

export default ChatAssistantRichContent;
