import classNames from '@/common/utils/classNames';
import { VARDAST_NAME, vardastType } from '@/modules/hami/components/chatAssistantTypography';

interface ChatAssistantIntroProps {
  visible?: boolean;
  isLoading?: boolean;
}

export const ChatAssistantIntro = ({ visible = true, isLoading }: ChatAssistantIntroProps) => (
  <div
    className={classNames('space-y-1.5 text-right transition-all duration-300', {
      'translate-y-2 opacity-0': !visible,
      'translate-y-0 opacity-100': visible,
    })}
  >
    <p className={vardastType.greeting}>سلام دکتر عزیز 👋</p>
    <p className={vardastType.body}>
      {isLoading
        ? 'چند لحظه صبر کنید، در حال بررسی اطلاعات هستم.'
        : `من ${VARDAST_NAME} هستم؛ اینجا هستم تا در این ویزیت کنار شما باشم و کارها را سریع‌تر پیش ببریم.`}
    </p>
  </div>
);

export default ChatAssistantIntro;
