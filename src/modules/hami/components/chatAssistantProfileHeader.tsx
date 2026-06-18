import SparkleIcon from '@/common/components/icons/sparkle';
import classNames from '@/common/utils/classNames';
import { VARDAST_BRAND_NAME, vardastGlass, vardastType } from '@/modules/hami/components/chatAssistantTypography';

export const ChatAssistantProfileHeader = () => (
  <div className={classNames('relative z-[3] shrink-0 px-5 py-3.5', vardastGlass.header)}>
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#6B8AFF] shadow-sm shadow-primary/25 ring-2 ring-white/70">
        <SparkleIcon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <p className={vardastType.profileName}>{VARDAST_BRAND_NAME}</p>
        <p className={vardastType.profileStatus}>آنلاین</p>
      </div>
    </div>
  </div>
);

export default ChatAssistantProfileHeader;
