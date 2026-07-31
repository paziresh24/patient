import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { DsCard, DsMonthCalendar, ds } from '../designSystem';
import { useDoctorHomeNotifications } from '../hooks/useDoctorHomeNotifications';
import { FeedActionsSection } from './feedActionsSection';
import { FeedAlertsSection } from './feedAlertsSection';
import { FeedAppointmentsSection } from './feedAppointmentsSection';
import { FeedGreeting } from './feedGreeting';
import { FeedInsightSection } from './feedInsightSection';
import { FeedMotion } from './feedMotion';
import { FeedWidgetsSection } from './feedWidgetsSection';

export const DoctorHomeDesktopWorkstation = () => {
  const user = useUserInfoStore(state => state.info);
  const { notificationDateSet } = useDoctorHomeNotifications(user);

  return (
    <div className={classNames('hidden md:grid', ds.layout.workstationGrid)} dir="rtl">
      <FeedMotion index={0} className={ds.layout.workstationCalendar}>
        <aside aria-label="تقویم و ابزارک‌ها" className="flex min-w-0 flex-col gap-4">
          <DsCard padding="lg" className="min-w-0">
            <DsMonthCalendar markedDates={notificationDateSet} />
          </DsCard>

          <FeedWidgetsSection />
        </aside>
      </FeedMotion>

      <FeedMotion index={1} className={ds.layout.workstationMain}>
        <main aria-label="مراجعین" className="flex min-w-0 flex-col gap-4">
          <FeedGreeting hideDateStrip hideStats workstationLayout />
          <FeedAlertsSection />
          <FeedAppointmentsSection scheduleExpanded embedCenterStrip />
        </main>
      </FeedMotion>

      <FeedMotion index={2} className={ds.layout.workstationTools}>
        <aside aria-label="برنامه امروز و شاخص‌ها" className="flex min-w-0 flex-col gap-4">
          <FeedActionsSection hideSectionHeader />
          <FeedInsightSection variant="stack" />
        </aside>
      </FeedMotion>
    </div>
  );
};
