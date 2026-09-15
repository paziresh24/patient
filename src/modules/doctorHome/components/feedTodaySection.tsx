import moment from 'jalali-moment';
import { DsCard, DsSectionHeader } from '../designSystem';
import { useSelectedDateStore } from '../store/selectedDate';
import { FeedActionsSection } from './feedActionsSection';
import { FeedAppointmentsSection } from './feedAppointmentsSection';

/** One card: visit + clinic + appointments. */
export const FeedTodaySection = () => {
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const selectedMoment = moment(selectedDate, 'YYYY-MM-DD');
  const title = selectedMoment.isSame(moment(), 'day')
    ? 'برنامه امروز'
    : `برنامه ${selectedMoment.clone().locale('fa').format('jD jMMMM')}`;

  return (
    <section dir="rtl" aria-label={title}>
      <DsSectionHeader title={title} />
      <DsCard padding="none" className="overflow-hidden">
        <FeedActionsSection nested hideSectionHeader />
        <FeedAppointmentsSection nested />
      </DsCard>
    </section>
  );
};
