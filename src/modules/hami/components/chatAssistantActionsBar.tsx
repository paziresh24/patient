import classNames from '@/common/utils/classNames';
import { VardastWorkflowAppPopupAction } from '@/modules/hami/apis/parseVardastActions';
import { ChatAssistantActionTags } from '@/modules/hami/components/chatAssistantWidgetButton';

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
        'shrink-0 border-t border-slate-200 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_-6px_rgba(15,23,42,0.06)] transition-all duration-300',
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
