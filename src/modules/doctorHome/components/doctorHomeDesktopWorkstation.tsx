import classNames from '@/common/utils/classNames';
import { DoctorHomeFeedItem, DoctorHomeFeedStats } from '../types/feed';
import { DsCard, DsMonthCalendar, ds } from '../designSystem';
import { FeedGreeting } from './feedGreeting';
import { FeedInsightSection } from './feedInsightSection';
import { FeedItem } from './feedItem';
import { FeedMotion } from './feedMotion';
import { FeedWidgetsSection } from './feedWidgetsSection';

interface DoctorHomeDesktopWorkstationProps {
  items: DoctorHomeFeedItem[];
  stats?: DoctorHomeFeedStats;
  notificationDateSet?: Set<string>;
}

const filterItems = (items: DoctorHomeFeedItem[], types: Set<DoctorHomeFeedItem['type']>) =>
  items.filter(item => types.has(item.type));

const TOOLS_TYPES = new Set<DoctorHomeFeedItem['type']>(['actions', 'online_visit']);
const ALERT_TYPES = new Set<DoctorHomeFeedItem['type']>(['alert', 'alerts']);
const APPOINTMENT_TYPES = new Set<DoctorHomeFeedItem['type']>(['appointments_list', 'empty']);
const LOADING_APPOINTMENT_TYPES = new Set<DoctorHomeFeedItem['type']>(['loading']);

export const DoctorHomeDesktopWorkstation = ({
  items,
  stats,
  notificationDateSet,
}: DoctorHomeDesktopWorkstationProps) => {
  const toolsItems = filterItems(items, TOOLS_TYPES);
  const alertItems = filterItems(items, ALERT_TYPES);
  const appointmentItems = items.filter(
    item =>
      APPOINTMENT_TYPES.has(item.type) ||
      (LOADING_APPOINTMENT_TYPES.has(item.type) && item.type === 'loading' && item.data.variant === 'appointment'),
  );

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
          <FeedGreeting
            hideDateStrip
            hideStats
            workstationLayout
            stats={stats}
            notificationDateSet={notificationDateSet}
          />

          {alertItems.map((item, index) => (
            <FeedMotion key={item.id} index={index + 2}>
              <FeedItem item={item} />
            </FeedMotion>
          ))}

          {appointmentItems.map((item, index) => (
            <FeedMotion key={item.id} index={alertItems.length + index + 2}>
              <FeedItem item={item} scheduleExpanded embedCenterStrip />
            </FeedMotion>
          ))}
        </main>
      </FeedMotion>

      <FeedMotion index={2} className={ds.layout.workstationTools}>
        <aside aria-label="برنامه امروز و شاخص‌ها" className="flex min-w-0 flex-col gap-4">
          {toolsItems.map((item, index) => (
            <FeedMotion key={item.id} index={index + 3}>
              <FeedItem item={item} hideSectionHeader />
            </FeedMotion>
          ))}

          <FeedMotion index={toolsItems.length + 3}>
            <FeedInsightSection stats={stats} variant="stack" />
          </FeedMotion>
        </aside>
      </FeedMotion>
    </div>
  );
};
