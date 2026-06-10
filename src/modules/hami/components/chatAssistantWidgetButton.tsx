import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import useResponsive from '@/common/hooks/useResponsive';
import { VardastWorkflowAppPopupAction } from '@/modules/hami/apis/parseVardastActions';
import { vardastType } from '@/modules/hami/components/chatAssistantTypography';
import { AppFrame } from '@/modules/hamdast/appFrame';
import { useState } from 'react';

export interface ChatAssistantActionTagsProps {
  chatId: string;
  actions: VardastWorkflowAppPopupAction[];
  appointmentId?: string;
}

export const ChatAssistantActionTags = ({ chatId, actions, appointmentId }: ChatAssistantActionTagsProps) => {
  const [activeAction, setActiveAction] = useState<VardastWorkflowAppPopupAction | null>(null);
  const { handleOpen, handleClose, modalProps } = useModal({
    onClose: () => setActiveAction(null),
  });
  const { isMobile } = useResponsive();

  if (actions.length === 0) return null;

  return (
    <>
      <div className="-mx-1 flex justify-start gap-2.5 overflow-x-auto overscroll-x-contain px-1 py-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {actions.map(action => (
          <button
            key={`${action.app_key}-${action.title}`}
            type="button"
            onClick={() => {
              setActiveAction(action);
              handleOpen();
            }}
            className={vardastType.actionChip}
          >
            {action.title}
          </button>
        ))}
      </div>

      {activeAction && (
        <Modal
          {...modalProps}
          onClose={handleClose}
          fullScreen={!isMobile}
          noHeader
          bodyClassName="p-0 h-[45rem]"
        >
          <AppFrame
            dontShowNotification
            dontShowAppBar
            dontShowProfile
            appKey={activeAction.app_key}
            params={['flows', 'CHAT']}
            queries={{
              'hami.chat_id': chatId,
              open_from: 'vardast',
              ...(appointmentId ? { appointment_id: appointmentId } : {}),
              ...activeAction.parameters,
            }}
          />
        </Modal>
      )}
    </>
  );
};

/** @deprecated use ChatAssistantActionTags */
export const ChatAssistantWidgetTag = ChatAssistantActionTags;

export default ChatAssistantActionTags;
