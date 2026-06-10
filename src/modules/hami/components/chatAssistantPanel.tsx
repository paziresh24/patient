import classNames from '@/common/utils/classNames';
import { ChatAssistantActionsBar } from '@/modules/hami/components/chatAssistantActionsBar';
import { ChatAssistantIntro } from '@/modules/hami/components/chatAssistantIntro';
import { ChatAssistantProfileHeader } from '@/modules/hami/components/chatAssistantProfileHeader';
import { ChatAssistantUnsupported } from '@/modules/hami/components/chatAssistantUnsupported';
import { vardastPanelClass } from '@/modules/hami/components/chatAssistantTypography';
import { ChatAssistantWorkflowWidget } from '@/modules/hami/components/chatAssistantWorkflowWidget';
import { useVardastWorkflow } from '@/modules/hami/context/vardastWorkflowContext';
import { useHamiVardastActions } from '@/modules/hami/hooks/useHamiVardastActions';
import { useEffect, useState } from 'react';

interface ChatAssistantPanelProps {
  isOpen: boolean;
  chatId: string | null;
}

export const ChatAssistantPanel = ({ isOpen, chatId }: ChatAssistantPanelProps) => {
  const [showContent, setShowContent] = useState(false);
  const { messages, appointmentId: workflowAppointmentId, isLoading, isUnsupported } = useVardastWorkflow();
  const { actions, appointmentId: actionsAppointmentId } = useHamiVardastActions(chatId, isOpen);
  const appointmentId = actionsAppointmentId ?? workflowAppointmentId;

  useEffect(() => {
    if (!isOpen) {
      setShowContent(false);
      return;
    }

    const frame = requestAnimationFrame(() => setShowContent(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const showInitialLoading = isLoading && messages.length === 0 && !isUnsupported;
  const showBody = showContent && (messages.length > 0 || showInitialLoading || isUnsupported);

  return (
    <div className={classNames('flex min-h-0 flex-1 flex-col bg-slate-50', vardastPanelClass)}>
      <ChatAssistantProfileHeader />

      <div
        data-vardast-panel-scroll
        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-5 pb-6 pt-5 no-scroll [-webkit-overflow-scrolling:touch] [touch-action:pan-y]"
        onTouchStart={event => event.stopPropagation()}
      >
        {showBody && !isUnsupported && (
          <ChatAssistantIntro visible={showContent} isLoading={showInitialLoading} />
        )}

        {messages.map((message, index) => (
          <ChatAssistantWorkflowWidget
            key={`${message.app?.key ?? 'message'}-${index}`}
            item={message}
            visible={showContent}
            index={index}
          />
        ))}

        {isUnsupported && <ChatAssistantUnsupported visible={showContent} />}
      </div>

      {chatId && (
        <ChatAssistantActionsBar
          chatId={chatId}
          actions={actions}
          appointmentId={appointmentId}
          visible={showContent}
        />
      )}
    </div>
  );
};

export default ChatAssistantPanel;
