import classNames from '@/common/utils/classNames';
import { ds } from '../designSystem';
import { DoctorHomeSheetLayoutProvider } from '../hooks/doctorHomeSheetLayout';
import { DoctorHomeDesktopWorkstation } from './doctorHomeDesktopWorkstation';
import { FeedTodaySection } from './feedTodaySection';
import { FeedAlertsSection } from './feedAlertsSection';
import { FeedGreeting } from './feedGreeting';
import { FeedGrowthPathSection } from './feedGrowthPathSection';
import { FeedMotion } from './feedMotion';
import { FeedReviewsSection } from './feedReviewsSection';
import { FeedWidgetsSection } from './feedWidgetsSection';

interface DoctorHomeFeedProps {
  className?: string;
}

export const DoctorHomeFeed = ({ className }: DoctorHomeFeedProps) => {
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
            <FeedTodaySection />
          </FeedMotion>
          <FeedMotion index={3}>
            <FeedReviewsSection />
          </FeedMotion>
          <div className="mt-1 flex flex-col gap-3">
            <FeedMotion index={4}>
              <FeedGrowthPathSection />
            </FeedMotion>
            <FeedMotion index={5}>
              <FeedWidgetsSection />
            </FeedMotion>
          </div>
        </div>
      </DoctorHomeSheetLayoutProvider>

      <DoctorHomeSheetLayoutProvider layout="desktop">
        <DoctorHomeDesktopWorkstation />
      </DoctorHomeSheetLayoutProvider>
    </main>
  );
};
