import ToolCaseIcon from '@/common/components/icons/toolCase';
import classNames from '@/common/utils/classNames';
import { vardastGlass, vardastType } from '@/modules/hami/components/chatAssistantTypography';
import { useHamdastAppsSelectorModal } from '@/modules/hamdast/components/apps-selector-modal';

interface ChatAssistantNoWidgetsProps {
  visible?: boolean;
  chatId?: string | null;
}

export const ChatAssistantNoWidgets = ({ visible = true, chatId }: ChatAssistantNoWidgetsProps) => {
  const appsSelectorModalRef = useHamdastAppsSelectorModal();

  const handleOpenAppsModal = () => {
    appsSelectorModalRef?.current?.open(undefined, undefined, 'جعبه ابزار', 'assistant', {
      openInModal: true,
      chatId: chatId ?? undefined,
    });
  };

  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center px-2 py-4 text-center transition-all duration-300',
        {
          'translate-y-2 opacity-0': !visible,
          'translate-y-0 opacity-100': visible,
        },
      )}
    >
      <div className={classNames('w-full rounded-2xl rounded-br-md px-4 py-5', vardastGlass.bubble)}>
        <p className={classNames(vardastType.body, 'text-slate-600')}>هنوز هیچ ابزارکی رو فعال نکردید</p>

        <button
          type="button"
          onClick={handleOpenAppsModal}
          className={classNames(
            'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary transition active:scale-[0.99]',
            vardastGlass.chip,
          )}
        >
          <ToolCaseIcon className="h-4 w-4" />
          مشاهده جعبه ابزار
        </button>
      </div>
    </div>
  );
};

export default ChatAssistantNoWidgets;
