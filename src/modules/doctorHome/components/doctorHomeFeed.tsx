import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { ds } from '../designSystem';
import { DoctorHomeSheetLayoutProvider } from '../hooks/doctorHomeSheetLayout';
import { useDoctorHomeContext } from '../hooks/useDoctorHomeContext';
import { DoctorHomeDesktopWorkstation } from './doctorHomeDesktopWorkstation';
import { FeedActionsSection } from './feedActionsSection';
import { FeedAlertsSection } from './feedAlertsSection';
import { FeedAppointmentsSection } from './feedAppointmentsSection';
import { FeedGreeting } from './feedGreeting';
import { FeedGrowthPathSection } from './feedGrowthPathSection';
import { FeedMotion } from './feedMotion';
import { FeedReviewsSection } from './feedReviewsSection';
import { FeedWidgetsSection } from './feedWidgetsSection';

interface DoctorHomeFeedProps {
  className?: string;
}

export const DoctorHomeFeed = ({ className }: DoctorHomeFeedProps) => {
  const user = useUserInfoStore(state => state.info);
  const { isDoctor } = useDoctorHomeContext(user);

  if (!isDoctor) return null;

  return (
    <main aria-label="صفحه اصلی پزشک" className={classNames('flex flex-col', ds.layout.feedSectionGap, className)}>
      <DoctorHomeSheetLayoutProvider layout="mobile">
        <div className={classNames('flex flex-col md:hidden', ds.layout.feedSectionGap)}>
          <FeedMotion index={0}>
            <FeedGreeting />
          </FeedMotion>
          <FeedMotion index={1}>
            <FeedAlertsSection />
          </FeedMotion>
          <FeedMotion index={2}>
            <div className="flex flex-col gap-2">
              <FeedActionsSection />
              <FeedAppointmentsSection />
            </div>
          </FeedMotion>
          <FeedMotion index={3}>
            <FeedGrowthPathSection />
          </FeedMotion>
          <FeedMotion index={4}>
            <FeedReviewsSection />
          </FeedMotion>
          <FeedMotion index={5}>
            <FeedWidgetsSection />
          </FeedMotion>
        </div>
      </DoctorHomeSheetLayoutProvider>

      <DoctorHomeSheetLayoutProvider layout="desktop">
        <DoctorHomeDesktopWorkstation />
      </DoctorHomeSheetLayoutProvider>
    </main>
  );
};
