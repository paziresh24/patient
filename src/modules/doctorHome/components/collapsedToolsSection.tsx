import ToolCaseIcon from '@/common/components/icons/toolCase';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { SectionCard } from './sectionCard';

export const CollapsedToolsSection = () => {
  const userId = useUserInfoStore(state => state.info?.id);

  return (
    <SectionCard>
      <Link
        href="/_/apps"
        onClick={() => sendDoctorHomeEvent(userId, 'tools_see_all')}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <ToolCaseIcon className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">ابزارها و امکانات</p>
            <p className="text-xs text-slate-500">مشاهده جعبه ابزار و افزونه‌ها</p>
          </div>
        </div>
        <span className="text-xs font-medium text-primary">مشاهده همه</span>
      </Link>
    </SectionCard>
  );
};
