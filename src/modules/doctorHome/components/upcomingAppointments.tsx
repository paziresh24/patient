import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import moment from 'jalali-moment';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { UpcomingAppointment } from '../apis/upcomingAppointments';
import { ds } from '../designSystem/tokens';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { SectionCard } from './sectionCard';
import { SectionHeader } from './sectionHeader';

interface UpcomingAppointmentsProps {
  items: UpcomingAppointment[];
  todayCount: number | null;
  isLoading: boolean;
  isError: boolean;
  className?: string;
}

const formatTime = (item: UpcomingAppointment) => {
  if (item.from) return moment.unix(item.from).format('HH:mm');
  if (item.book_time_string) return item.book_time_string;
  return '—';
};

const AppointmentRow = ({ item }: { item: UpcomingAppointment }) => (
  <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0">
    <div className="min-w-0 flex-1">
      <p className={ds.type.bodyMedium}>{item.patient_name}</p>
      <p className={classNames(ds.type.caption, 'mt-0.5')}>
        {item.center_name}
        {item.service_name ? ` · ${item.service_name}` : ''}
      </p>
    </div>
    <div className="shrink-0 text-left">
      <p className={ds.type.count}>{formatTime(item)}</p>
      <p className={classNames(ds.type.captionSm, 'mt-0.5', item.is_online_visit ? ds.type.online : 'text-slate-500')}>
        {item.is_online_visit ? 'آنلاین' : 'حضوری'}
      </p>
    </div>
  </div>
);

export const UpcomingAppointments = ({ items, todayCount, isLoading, isError, className }: UpcomingAppointmentsProps) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const subtitle =
    todayCount != null ? `امروز ${todayCount.toLocaleString('fa-IR')} نوبت` : undefined;

  return (
    <SectionCard className={className}>
      <SectionHeader
        title="نوبت‌های نزدیک"
        subtitle={subtitle}
        href="/dashboard/apps/drapp/appointments/"
        onSeeAllClick={() => sendDoctorHomeEvent(userId, 'appointments_see_all')}
      />

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} h="3rem" w="100%" rounded="lg" />
          ))}
        </div>
      )}

      {!isLoading && isError && items.length === 0 && (
        <div className={classNames(ds.surface.emptyState, ds.layout.rowPadding, 'text-center')}>
          <p className={ds.type.cardBody}>لیست نوبت‌ها به‌زودی اینجا نمایش داده می‌شود.</p>
          <a
            href="/dashboard/apps/drapp/appointments/"
            className={classNames(ds.type.link, 'mt-2 inline-block')}
            onClick={() => sendDoctorHomeEvent(userId, 'appointments_see_all')}
          >
            مشاهده مراجعین من
          </a>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <p className={classNames(ds.type.emptyState, 'py-4 text-center')}>نوبت پیش‌رویی ندارید.</p>
      )}

      {!isLoading && items.length > 0 && (
        <div>
          {items.map(item => (
            <AppointmentRow key={item.book_id} item={item} />
          ))}
        </div>
      )}
    </SectionCard>
  );
};
