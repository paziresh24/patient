import classNames from '@/common/utils/classNames';
import { ChatAssistantActionsBar } from '@/modules/hami/components/chatAssistantActionsBar';
import { ChatAssistantIntro } from '@/modules/hami/components/chatAssistantIntro';
import { ChatAssistantProfileHeader } from '@/modules/hami/components/chatAssistantProfileHeader';
import { ChatAssistantNoWidgets } from '@/modules/hami/components/chatAssistantNoWidgets';
import { ChatAssistantUnsupported } from '@/modules/hami/components/chatAssistantUnsupported';
import { vardastPanelClass } from '@/modules/hami/components/chatAssistantTypography';
import { ChatAssistantWorkflowWidget } from '@/modules/hami/components/chatAssistantWorkflowWidget';
import { useVardastWorkflow } from '@/modules/hami/context/vardastWorkflowContext';
import { useHamiVardastActions } from '@/modules/hami/hooks/useHamiVardastActions';
import { useEffect, useState } from 'react';

interface ChatAssistantPanelProps {
  isOpen: boolean;
  chatId: string | null;
  hasChatWidget?: boolean;
  isWidgetsLoading?: boolean;
}

export const ChatAssistantPanel = ({
  isOpen,
  chatId,
  hasChatWidget = false,
  isWidgetsLoading = false,
}: ChatAssistantPanelProps) => {
  const [showContent, setShowContent] = useState(false);
  const { messages, appointmentId: workflowAppointmentId, isLoading, isUnsupported } = useVardastWorkflow();
  const vardastEnabled = hasChatWidget && !isWidgetsLoading;
  const { actions, appointmentId: actionsAppointmentId } = useHamiVardastActions(chatId, isOpen, vardastEnabled);
  const appointmentId = actionsAppointmentId ?? workflowAppointmentId;

  useEffect(() => {
    if (!isOpen) {
      setShowContent(false);
      return;
    }

    const frame = requestAnimationFrame(() => setShowContent(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const showNoWidgets = !isWidgetsLoading && !hasChatWidget;
  const showInitialLoading = vardastEnabled && isLoading && messages.length === 0 && !isUnsupported;

  return (
    <div className={classNames('flex min-h-0 flex-1 flex-col', vardastPanelClass)}>
      <ChatAssistantProfileHeader />

      <div
        data-vardast-panel-scroll
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 pb-6 pt-4 no-scroll [-webkit-overflow-scrolling:touch] [touch-action:pan-y]"
        onTouchStart={event => event.stopPropagation()}
      >
        {showContent && <ChatAssistantIntro visible={showContent} isLoading={showInitialLoading} />}

        {showNoWidgets && <ChatAssistantNoWidgets visible={showContent} chatId={chatId} />}

        {messages.map((message, index) => (
          <ChatAssistantWorkflowWidget
            key={`${message.app?.key ?? 'message'}-${index}`}
            item={message}
            visible={showContent}
            index={index}
          />
        ))}

        {hasChatWidget && isUnsupported && <ChatAssistantUnsupported visible={showContent} />}
      </div>

      {chatId && vardastEnabled && (
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
