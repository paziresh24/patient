import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { RaviCard } from '@/modules/rate-and-review';
import moment from 'jalali-moment';
import { useEffect, useMemo, useState } from 'react';
import { UpcomingAppointment } from '../apis/upcomingAppointments';
import { DsDrawer } from './DsDrawer';
import { useSheetDrawerProps } from '../hooks/doctorHomeSheetLayout';
import { useSheetRoute } from '../hooks/useSheetRoute';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { useSelectedDateStore } from '../store/selectedDate';
import { useAppointmentsScheduleExpandedStore } from '../store/appointmentsScheduleExpanded';
import { DOCTOR_PANEL_URLS, RAVI_DOCSIDE_URL } from '../utils/doctorPanelUrls';
import { mapFeedReviewToRaviReview } from '../utils/mapFeedReviewToRavi';
import { formatSelectedDateLabel } from '../utils/normalizeNotification';
import {
  DsButton,
  DsCard,
  DsSectionHeader,
  DsTimeline,
  DsTimelineItem,
  DsTaskCard,
  DsBadge,
  ds,
} from '../designSystem';
import { DoctorHomeFeedItem, DoctorHomeFeedReview } from '../types/feed';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { appendUserIdToUrl, buildDoctorPanelUrl } from '../utils/iframeUrl';
import { dsFocusRing } from '../utils/a11y';
import { getAppointmentTimelineStatuses } from '../utils/timelineStatus';
import { FeedActionsSection } from './feedActionsSection';
import { NotificationsSection } from './notificationsSection';
import { AppointmentsCountRow } from './appointmentsCountRow';
import { AppointmentsCardSkeleton, AppointmentsTimelineSkeleton } from './appointmentsCardSkeleton';
import { CenterStrip } from './centerStrip';
import { DsCollapsible } from './dsCollapsible';
import { FeedContentSwap, FeedStaggerItem } from './feedContentSwap';
import { ExpandChevronIcon } from './icons';

const PillButton = ({ children }: { children: string }) => (
  <span className={ds.schedule.nextPill}>{children}</span>
);

const formatAppointmentTime = (appointment: UpcomingAppointment) =>
  appointment.from
    ? moment.unix(appointment.from).format('HH:mm')
    : appointment.book_time_string || '—';

const AppointmentsFeedItem = ({
  data,
  scheduleExpanded = false,
  widgetShell = false,
  embedCenterStrip = false,
}: {
  data: {
    items: UpcomingAppointment[];
    todayCount: number | null;
    isTodayCountLoading?: boolean;
    isAppointmentsLoading?: boolean;
    isAppointmentsFetching?: boolean;
  };
  scheduleExpanded?: boolean;
  widgetShell?: boolean;
  embedCenterStrip?: boolean;
}) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const selectedCenterId = useSelectedCenterStore(state => state.selectedCenterId);
  const isExpanded = useAppointmentsScheduleExpandedStore(state => state.isExpanded);
  const isScheduleHydrated = useAppointmentsScheduleExpandedStore(state => state.hydrated);
  const hydrateScheduleExpanded = useAppointmentsScheduleExpandedStore(state => state.hydrate);
  const toggleScheduleExpanded = useAppointmentsScheduleExpandedStore(state => state.toggle);
  const selectedMoment = moment(selectedDate, 'YYYY-MM-DD');
  const isToday = selectedMoment.isSame(moment(), 'day');
  const sectionTitle = 'مراجعین من';
  const statuses = getAppointmentTimelineStatuses(data.items, selectedDate);
  const hasItems = data.items.length > 0;
  const expanded = scheduleExpanded || isExpanded;
  const isAppointmentsInitialLoading = data.isAppointmentsLoading ?? false;
  const isAppointmentsFetching = data.isAppointmentsFetching ?? false;
  const showTimeline = isScheduleHydrated && expanded && hasItems && !isAppointmentsFetching;
  const showTimelineLoading =
    isScheduleHydrated && expanded && !hasItems && (isAppointmentsInitialLoading || isAppointmentsFetching);
  const showEmptyState =
    isScheduleHydrated && expanded && !hasItems && !isAppointmentsInitialLoading && !isAppointmentsFetching;

  const allSheet = useSheetRoute('appointments-all');
  const appointmentsDrawerProps = useSheetDrawerProps(allSheet);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [patientsCenterId, setPatientsCenterId] = useState<string | undefined>(undefined);
  const appointmentsSwapKey = `${selectedDate}-${patientsCenterId ?? selectedCenterId ?? 'all'}-${data.todayCount ?? 'x'}`;
  const schedulePanelId = 'appointments-schedule-panel';
  const myPatientsUrl = useMemo(
    () =>
      buildDoctorPanelUrl(DOCTOR_PANEL_URLS.myPatients, {
        userId,
        date: selectedDate,
        centerId: patientsCenterId ?? selectedCenterId,
        bookId: selectedBookId,
      }),
    [userId, selectedDate, patientsCenterId, selectedCenterId, selectedBookId],
  );

  useEffect(() => {
    hydrateScheduleExpanded();
  }, [hydrateScheduleExpanded]);

  const openAllAppointments = (options?: { bookId?: string; centerId?: string }) => {
    setSelectedBookId(options?.bookId ?? null);
    setPatientsCenterId(options?.centerId);
    sendDoctorHomeEvent(userId, 'appointments_see_all');
    allSheet.openSheet();
  };

  if (isAppointmentsInitialLoading && expanded) {
    return (
      <AppointmentsCardSkeleton
        embedCenterStrip={embedCenterStrip}
        rows={scheduleExpanded ? 3 : 4}
        className={widgetShell ? undefined : '-mt-4 md:mt-0'}
        title={sectionTitle}
      />
    );
  }

  return (
    <section dir="rtl" className={widgetShell ? undefined : '-mt-4 md:mt-0'}>
      <DsCard padding="none" variant={widgetShell ? 'widget' : 'default'} className="overflow-hidden">
        {embedCenterStrip && (
          <div className="border-b border-slate-100 px-3 py-2.5">
            <CenterStrip />
          </div>
        )}
        <AppointmentsCountRow
          title={sectionTitle}
          count={data.todayCount}
          isLoading={data.isTodayCountLoading && data.todayCount == null}
          userId={userId}
          onPress={() => openAllAppointments()}
          widgetShell={widgetShell}
          trailing={
            !scheduleExpanded && isScheduleHydrated ? (
              <button
                type="button"
                onClick={() => toggleScheduleExpanded()}
                className={classNames('shrink-0 p-1', ds.motion.press, dsFocusRing)}
                aria-label={isExpanded ? 'پنهان کردن برنامه' : 'نمایش برنامه'}
                aria-expanded={isExpanded}
                aria-controls={schedulePanelId}
              >
                <ExpandChevronIcon
                  size="sm"
                  className={classNames('text-slate-300', ds.motion.chevron, isExpanded && 'rotate-180')}
                />
              </button>
            ) : null
          }
        />

        <DsCollapsible open={showTimeline} id={schedulePanelId}>
          <div className="border-t border-slate-100 px-3 pb-3 pt-2">
            <FeedContentSwap swapKey={appointmentsSwapKey} variant="slide">
              <DsTimeline>
                {data.items.map((appointment, index) => (
                  <FeedStaggerItem key={appointment.book_id} index={index}>
                    <DsTimelineItem
                      status={statuses[index]}
                      isLast={index === data.items.length - 1}
                      compact
                    >
                      <DsTaskCard
                        compact
                        highlighted={isToday && statuses[index] === 'current'}
                        onClick={() =>
                          openAllAppointments({
                            bookId: appointment.book_id,
                            centerId: selectedCenterId ?? appointment.center_id,
                          })
                        }
                        title={appointment.patient_name}
                        meta={[appointment.center_name, appointment.service_name].filter(Boolean).join(' · ')}
                        trailing={
                          <div className="shrink-0 text-left">
                            <p className={classNames(ds.type.cardTitle, 'tabular-nums')}>
                              {formatAppointmentTime(appointment)}
                            </p>
                            <DsBadge
                              tone={appointment.is_online_visit ? 'online' : 'neutral'}
                              className="mt-1"
                            >
                              {appointment.is_online_visit ? 'آنلاین' : 'حضوری'}
                            </DsBadge>
                          </div>
                        }
                      >
                        {isToday && statuses[index] === 'current' && <PillButton>نوبت بعدی</PillButton>}
                      </DsTaskCard>
                    </DsTimelineItem>
                  </FeedStaggerItem>
                ))}
              </DsTimeline>
            </FeedContentSwap>
          </div>
        </DsCollapsible>

        <DsCollapsible open={showTimelineLoading}>
          <FeedContentSwap swapKey={`${appointmentsSwapKey}-loading`} variant="fade">
            <div className="border-t border-slate-100">
              <AppointmentsTimelineSkeleton rows={scheduleExpanded ? 3 : 4} />
            </div>
          </FeedContentSwap>
        </DsCollapsible>

        <DsCollapsible open={showEmptyState}>
          <FeedContentSwap swapKey={`${appointmentsSwapKey}-empty`} variant="fade">
            <div className="border-t border-slate-100 px-4 py-6 text-center">
              <p className={ds.type.caption}>نوبتی ثبت نشده</p>
            </div>
          </FeedContentSwap>
        </DsCollapsible>
      </DsCard>

      <DsDrawer
        {...appointmentsDrawerProps}
        title="لیست نوبت‌ها"
        description="مشاهده و مدیریت نوبت‌ها"
        fullHeight
        className="!p-0"
      >
        {allSheet.open && (
          <iframe
            key={`${selectedDate}-${patientsCenterId ?? selectedCenterId ?? 'all'}-${selectedBookId ?? 'all'}`}
            src={myPatientsUrl}
            title="لیست نوبت‌ها"
            className="min-h-0 w-full flex-1 border-0"
          />
        )}
      </DsDrawer>
    </section>
  );
};

const ReviewsFeedItem = ({
  data,
}: {
  data: { items: DoctorHomeFeedReview[]; slug?: string; doctorUserId?: string };
}) => {
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const selectedDateLabel = formatSelectedDateLabel(selectedDate);

  const allSheet = useSheetRoute('reviews-all');
  const reviewsDrawerProps = useSheetDrawerProps(allSheet);

  if (data.items.length === 0) return null;

  return (
    <section>
      <DsSectionHeader
        title="بازخورد بیماران"
        subtitle={`${data.items.length.toLocaleString('fa-IR')} نظر بی‌پاسخ · ${selectedDateLabel}`}
        linkAriaLabel="مشاهده همه بازخورد بیماران"
        onPress={() => {
          sendDoctorHomeEvent(userId, 'reviews_see_all');
          allSheet.openSheet();
        }}
      />

      <DsDrawer
        {...reviewsDrawerProps}
        title="بازخورد بیماران"
        description="نظرات بیماران"
        fullHeight
        className="!p-0"
      >
        {allSheet.open && (
          <iframe
            src={appendUserIdToUrl(RAVI_DOCSIDE_URL, userId)}
            title="راوی؛ نظرات بیماران"
            className="min-h-0 w-full flex-1 border-0"
          />
        )}
      </DsDrawer>

      <DsCard padding="none" className="overflow-hidden">
        {data.items.map((review, index) => (
          <RaviCard
            key={review.id ?? index}
            review={mapFeedReviewToRaviReview(review)}
            doctorSlug={data.slug}
            doctorUserId={data.doctorUserId}
          />
        ))}
      </DsCard>
    </section>
  );
};

interface FeedItemProps {
  item: DoctorHomeFeedItem;
  scheduleExpanded?: boolean;
  widgetShell?: boolean;
  hideSectionHeader?: boolean;
  embedCenterStrip?: boolean;
}

export const FeedItem = ({ item, scheduleExpanded, widgetShell, hideSectionHeader, embedCenterStrip }: FeedItemProps) => {
  const userId = useUserInfoStore(state => state.info?.id);

  switch (item.type) {
    case 'stats':
      return null;

    case 'actions':
      return <FeedActionsSection onlineVisit={item.data.onlineVisit} widgetShell={widgetShell} hideSectionHeader={hideSectionHeader} />;

    case 'online_visit':
      return <FeedActionsSection onlineVisit={item.data} widgetShell={widgetShell} hideSectionHeader={hideSectionHeader} />;

    case 'alert':
    case 'alerts':
      return (
        <NotificationsSection
          items={item.type === 'alerts' ? item.data.items : [item.data]}
          widgetShell={widgetShell}
        />
      );

    case 'appointments_list':
      return <AppointmentsFeedItem data={item.data} scheduleExpanded={scheduleExpanded} widgetShell={widgetShell} embedCenterStrip={embedCenterStrip} />;

    case 'reviews_list':
      return <ReviewsFeedItem data={item.data} />;

    case 'loading':
      if (item.data.variant === 'appointment') {
        return (
          <AppointmentsCardSkeleton
            embedCenterStrip={embedCenterStrip}
            rows={scheduleExpanded ? 3 : 4}
            className="-mt-4 md:mt-0"
          />
        );
      }
      return <Skeleton h="7rem" w="100%" rounded="lg" className="opacity-30" />;

    case 'empty':
      return (
        <DsCard className="text-center !shadow-sm" padding="lg">
          <p className={ds.type.cardBody}>{item.data.message}</p>
          {item.data.onLinkClick && (
            <div className="mt-4">
              <DsButton
                variant="ghost"
                onClick={() => {
                  if (item.data.href?.includes('appointments')) {
                    sendDoctorHomeEvent(userId, 'appointments_see_all');
                  }
                  item.data.onLinkClick?.();
                }}
              >
                {item.data.linkLabel ?? 'مشاهده'}
              </DsButton>
            </div>
          )}
        </DsCard>
      );

    default:
      return null;
  }
};
