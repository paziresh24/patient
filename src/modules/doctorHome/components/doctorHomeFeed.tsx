import classNames from '@/common/utils/classNames';
import { DoctorHomeFeedItem } from '../types/feed';
import { ds } from '../designSystem';
import { DoctorHomeSheetLayoutProvider } from '../hooks/doctorHomeSheetLayout';
import { DoctorHomeDesktopWorkstation } from './doctorHomeDesktopWorkstation';
import { FeedGreeting } from './feedGreeting';
import { FeedItem } from './feedItem';
import { FeedMotion } from './feedMotion';
import { FeedWidgetsSection } from './feedWidgetsSection';

interface DoctorHomeFeedProps {
  items: DoctorHomeFeedItem[];
  notificationDateSet?: Set<string>;
  className?: string;
}

export const DoctorHomeFeed = ({ items, notificationDateSet, className }: DoctorHomeFeedProps) => {
  const statsItem = items.find((item): item is Extract<DoctorHomeFeedItem, { type: 'stats' }> => item.type === 'stats');
  const feedItems = items.filter(item => item.type !== 'stats');

  return (
    <main aria-label="صفحه اصلی پزشک" className={classNames('flex flex-col', ds.layout.feedSectionGap, className)}>
      <DoctorHomeSheetLayoutProvider layout="mobile">
        <div className={classNames('flex flex-col md:hidden', ds.layout.feedSectionGap)}>
          <FeedMotion index={0}>
            <FeedGreeting
              stats={statsItem?.data}
              notificationDateSet={notificationDateSet}
            />
          </FeedMotion>
          {feedItems.map((item, index) => (
            <FeedMotion key={item.id} index={index + 1}>
              <FeedItem item={item} />
            </FeedMotion>
          ))}
          <FeedMotion index={feedItems.length + 1}>
            <FeedWidgetsSection />
          </FeedMotion>
        </div>
      </DoctorHomeSheetLayoutProvider>

      <DoctorHomeSheetLayoutProvider layout="desktop">
        <DoctorHomeDesktopWorkstation
          items={feedItems}
          stats={statsItem?.data}
          notificationDateSet={notificationDateSet}
        />
      </DoctorHomeSheetLayoutProvider>
    </main>
  );
};
