import classNames from '@/common/utils/classNames';
import { VardastWorkflowAppPopupAction } from '@/modules/hami/apis/parseVardastActions';
import { ChatAssistantActionTags } from '@/modules/hami/components/chatAssistantWidgetButton';
import { vardastGlass } from '@/modules/hami/components/chatAssistantTypography';

interface ChatAssistantActionsBarProps {
  chatId: string;
  actions: VardastWorkflowAppPopupAction[];
  appointmentId?: string;
  visible?: boolean;
}

export const ChatAssistantActionsBar = ({
  chatId,
  actions,
  appointmentId,
  visible = true,
}: ChatAssistantActionsBarProps) => {
  if (actions.length === 0) return null;

  return (
    <div
      className={classNames(
        'shrink-0 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300',
        vardastGlass.footer,
        {
          'translate-y-2 opacity-0': !visible,
          'translate-y-0 opacity-100': visible,
        },
      )}
      onTouchStart={event => event.stopPropagation()}
    >
      <ChatAssistantActionTags chatId={chatId} actions={actions} appointmentId={appointmentId} />
    </div>
  );
};

export default ChatAssistantActionsBar;
