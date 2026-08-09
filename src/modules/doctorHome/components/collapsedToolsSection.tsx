import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';
import { ds } from '../designSystem/tokens';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { SectionCard } from './sectionCard';
import { ToolsIcon } from './icons';

export const CollapsedToolsSection = () => {
  const userId = useUserInfoStore(state => state.info?.id);

  return (
    <SectionCard>
      <Link
        href="/_/apps"
        onClick={() => sendDoctorHomeEvent(userId, 'tools_see_all')}
        className={classNames('flex items-center justify-between', ds.layout.listRowGap)}
      >
        <div className={classNames('flex items-center', ds.layout.listRowGap)}>
          <div className={classNames('flex h-10 w-10 items-center justify-center rounded-full', ds.surface.iconCircle)}>
            <ToolsIcon size="lg" className="text-slate-600" />
          </div>
          <div>
            <p className={ds.type.cardTitle}>ابزارها و امکانات</p>
            <p className={ds.type.caption}>مشاهده جعبه ابزار و افزونه‌ها</p>
          </div>
        </div>
        <span className={ds.type.link}>مشاهده همه</span>
      </Link>
    </SectionCard>
  );
};
