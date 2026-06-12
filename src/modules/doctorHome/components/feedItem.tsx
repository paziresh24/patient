import Skeleton from '@/common/components/atom/skeleton';
import Switch from '@/common/components/atom/switch';
import BellIcon from '@/common/components/icons/bell';
import ChatIcon from '@/common/components/icons/chat';
import classNames from '@/common/utils/classNames';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useOnlineVisitServices, useToggleOnlineVisit } from '../apis/onlineVisit';
import { UpcomingAppointment } from '../apis/upcomingAppointments';
import { DsDrawer } from './DsDrawer';
import { AllAppointmentsDrawerContent, AppointmentDetailContent, PaginatedReviewsList, ReviewDetailContent, ReviewHeader } from './feedDrawerContents';
import { useSheetRoute } from '../hooks/useSheetRoute';
import {
  DsButton,
  DsCard,
  DsSectionHeader,
  DsTaskCard,
  DsTimeline,
  DsTimelineItem,
  DsBadge,
  ds,
} from '../designSystem';
import { DoctorHomeFeedItem, DoctorHomeFeedReview } from '../types/feed';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { getAppointmentTimelineStatuses } from '../utils/timelineStatus';


const PillButton = ({ children }: { children: string }) => (
  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
    {children}
  </span>
);



const AppointmentsFeedItem = ({
  data,
}: {
  data: { items: UpcomingAppointment[]; todayCount: number | null };
}) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const router = useRouter();
  const statuses = getAppointmentTimelineStatuses(data.items);

  const allSheet = useSheetRoute('appointments-all');
  const detailSheet = useSheetRoute('appointment-detail');

  // ID نوبت انتخاب‌شده از URL خونده میشه
  const apptId = router.query['appt-id'];
  const apptIdStr = Array.isArray(apptId) ? apptId[0] : (apptId ?? '');
  const selectedAppointment = apptIdStr
    ? (data.items.find(a => String(a.book_id) === apptIdStr) ?? null)
    : null;

  // آخرین نوبت رو نگه میداره تا انیمیشن close با محتوا پر بشه
  const lastApptRef = useRef<UpcomingAppointment | null>(null);
  if (detailSheet.open && selectedAppointment) {
    lastApptRef.current = selectedAppointment;
  }

  return (
    <section>
      <DsSectionHeader
        title="برنامه امروز"
        subtitle={
          data.todayCount != null
            ? `${data.todayCount.toLocaleString('fa-IR')} نوبت`
            : undefined
        }
        onPress={() => {
          sendDoctorHomeEvent(userId, 'appointments_see_all');
          allSheet.openSheet();
        }}
      />

      <DsDrawer
        open={allSheet.open}
        onOpenChange={o => { if (!o) allSheet.closeSheet(); }}
        title={
          data.todayCount != null
            ? `برنامه امروز · ${data.todayCount.toLocaleString('fa-IR')} نوبت`
            : 'برنامه امروز'
        }
        description="لیست نوبت‌های امروز"
      >
        <AllAppointmentsDrawerContent
          items={data.items}
          todayCount={data.todayCount}
          onSelectAppointment={id => detailSheet.openSheet({ 'appt-id': id })}
        />
      </DsDrawer>

      <DsDrawer
        open={detailSheet.open}
        onOpenChange={o => { if (!o) detailSheet.closeSheet(); }}
        title="جزئیات نوبت"
        description="اطلاعات بیمار و نوبت"
        level={1}
      >
        {(selectedAppointment ?? lastApptRef.current) && (
          <AppointmentDetailContent appointment={(selectedAppointment ?? lastApptRef.current)!} />
        )}
      </DsDrawer>

      <DsTimeline>
        {data.items.map((appointment, index) => (
          <DsTimelineItem
            key={appointment.book_id}
            status={statuses[index]}
            isLast={index === data.items.length - 1}
          >
            <DsTaskCard
              onClick={() => {
                sendDoctorHomeEvent(userId, 'appointments_see_all');
                detailSheet.openSheet({ 'appt-id': String(appointment.book_id) });
              }}
              title={appointment.patient_name}
              meta={[appointment.center_name, appointment.service_name].filter(Boolean).join(' · ')}
              trailing={
                <div className="text-left">
                  <p className="text-sm font-bold tabular-nums text-slate-800">
                    {appointment.from
                      ? moment.unix(appointment.from).format('HH:mm')
                      : appointment.book_time_string || '—'}
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
              {statuses[index] === 'current' && <PillButton>نوبت بعدی</PillButton>}
            </DsTaskCard>
          </DsTimelineItem>
        ))}
      </DsTimeline>
    </section>
  );
};

const ReviewsFeedItem = ({
  data,
}: {
  data: { items: DoctorHomeFeedReview[]; slug?: string; doctorUserId?: string };
}) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const router = useRouter();

  const allSheet = useSheetRoute('reviews-all');
  const detailSheet = useSheetRoute('review-detail');

  // نگه‌داشتن آبجکت نظرهای انتخاب‌شده (از فید یا از لیست صفحه‌بندی‌شده) برای resolve کردن detail
  const reviewsByIdRef = useRef<Record<string, DoctorHomeFeedReview>>({});
  data.items.forEach(r => { if (r.id != null) reviewsByIdRef.current[String(r.id)] = r; });

  const selectReview = (review: DoctorHomeFeedReview) => {
    if (review.id == null) return;
    reviewsByIdRef.current[String(review.id)] = review;
    detailSheet.openSheet({ 'review-id': String(review.id) });
  };

  const reviewId = router.query['review-id'];
  const reviewIdStr = Array.isArray(reviewId) ? reviewId[0] : (reviewId ?? '');
  const selectedReview = reviewIdStr ? (reviewsByIdRef.current[reviewIdStr] ?? null) : null;

  const lastReviewRef = useRef<DoctorHomeFeedReview | null>(null);
  if (detailSheet.open && selectedReview) {
    lastReviewRef.current = selectedReview;
  }

  return (
    <section>
      <DsSectionHeader
        title="بازخورد بیماران"
        subtitle={data.items.length > 0 ? `${data.items.length.toLocaleString('fa-IR')} نظر بی‌پاسخ` : undefined}
        onPress={() => {
          sendDoctorHomeEvent(userId, 'reviews_see_all');
          allSheet.openSheet();
        }}
      />

      <DsDrawer
        open={allSheet.open}
        onOpenChange={o => { if (!o) allSheet.closeSheet(); }}
        title="بازخورد بیماران"
        description="نظرات اخیر بیماران"
      >
        <PaginatedReviewsList slug={data.slug} onSelectReview={selectReview} />
      </DsDrawer>

      <DsDrawer
        open={detailSheet.open}
        onOpenChange={o => { if (!o) detailSheet.closeSheet(); }}
        title="نظر بیمار"
        description="جزئیات نظر"
        level={1}
      >
        {(selectedReview ?? lastReviewRef.current) && (
          <ReviewDetailContent
            review={(selectedReview ?? lastReviewRef.current)!}
            slug={data.slug}
            doctorUserId={data.doctorUserId}
          />
        )}
      </DsDrawer>

      {data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((review, index) => {
            const description = removeHtmlTagInString(String(review.description ?? '')).trim();

            return (
              <div
                key={review.id ?? index}
                role="button"
                onClick={() => {
                  sendDoctorHomeEvent(userId, 'reviews_see_all');
                  selectReview(review);
                }}
                className={classNames(ds.radius.card, 'cursor-pointer space-y-2 border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50')}
              >
                <ReviewHeader review={review} />
                <p className={classNames(ds.type.cardBody, 'line-clamp-2 leading-6 text-slate-700')}>
                  {description || 'بدون متن'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <DsCard className="text-center !shadow-sm" padding="lg">
          <p className={ds.type.cardBody}>به همه‌ی نظرهای جدید پاسخ داده‌اید ✓</p>
          <div className="mt-3">
            <DsButton variant="ghost" onClick={() => allSheet.openSheet()}>مشاهده همه نظرها</DsButton>
          </div>
        </DsCard>
      )}
    </section>
  );
};

const FeedOnlineVisit = ({
  userCenterId,
  hasOnlineVisitCenter,
}: {
  userCenterId?: string;
  hasOnlineVisitCenter: boolean;
}) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const { data, isLoading } = useOnlineVisitServices(userCenterId);
  const toggleMutation = useToggleOnlineVisit();
  const [isActive, setIsActive] = useState(false);

  const activationSheet = useSheetRoute('online-visit-activation');

  useEffect(() => {
    setIsActive(!!data?.data?.some(item => item.active_booking));
  }, [data]);

  const handleToggle = async (checked: boolean) => {
    if (!userCenterId || toggleMutation.isLoading) return;
    setIsActive(checked);
    try {
      await toggleMutation.mutateAsync({
        user_center_id: userCenterId,
        can_booking: checked ? '1' : '0',
      });
      sendDoctorHomeEvent(userId, 'online_visit_toggle', { is_on: checked });
    } catch {
      setIsActive(!checked);
    }
  };

  if (!hasOnlineVisitCenter) {
    return (
      <section>
        <DsSectionHeader title="اقدامات" />
        <DsDrawer
          open={activationSheet.open}
          onOpenChange={o => { if (!o) activationSheet.closeSheet(); }}
          title="فعال‌سازی ویزیت آنلاین"
          description="راهنمای فعال‌سازی"
        >
          <div className="flex flex-col items-center gap-4 px-4 pb-10 pt-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ChatIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">ویزیت آنلاین</p>
              <p className={classNames(ds.type.cardBody, 'mt-2 leading-6')}>
                برای فعال‌سازی ویزیت آنلاین و دریافت نوبت از بیماران، باید ابتدا پروفایل خود را در پنل پزشکی پاذیرش۲۴ تکمیل کنید.
              </p>
            </div>
          </div>
        </DsDrawer>
        <DsTaskCard
          title="فعال‌سازی ویزیت آنلاین"
          meta="بیماران بتوانند نوبت آنلاین بگیرند"
          onClick={() => activationSheet.openSheet()}
          trailing={
            <DsButton variant="primary" onClick={() => activationSheet.openSheet()}>
              شروع
            </DsButton>
          }
        />
      </section>
    );
  }

  return (
    <section>
      <DsSectionHeader title="اقدامات" />
      <DsCard padding="md" className="!shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ChatIcon className="h-5 w-5" />
            </div>
            <div>
              <p className={ds.type.cardTitle}>ویزیت آنلاین</p>
              <p className={classNames(ds.type.cardBody, 'mt-0.5')}>
                {isLoading ? 'بررسی…' : isActive ? 'فعال — نوبت باز است' : 'غیرفعال'}
              </p>
            </div>
          </div>
          <Switch
            checked={isActive}
            onChange={e => handleToggle(e.target.checked)}
            disabled={isLoading || toggleMutation.isLoading}
          />
        </div>
      </DsCard>
    </section>
  );
};

interface FeedItemProps {
  item: DoctorHomeFeedItem;
}

export const FeedItem = ({ item }: FeedItemProps) => {
  const userId = useUserInfoStore(state => state.info?.id);

  switch (item.type) {
    case 'stats':
      return null;

    case 'online_visit':
      return <FeedOnlineVisit {...item.data} />;

    case 'alert':
      return (
        <section>
          <DsSectionHeader title="اعلان‌ها" />
          <DsTaskCard
            title={item.data.title ?? 'اعلان جدید'}
            meta={item.data.description}
            onClick={() => sendDoctorHomeEvent(userId, 'notification_click')}
            trailing={<BellIcon className="h-5 w-5 text-amber-500" />}
          />
        </section>
      );

    case 'alerts':
      return (
        <section>
          <DsSectionHeader title="اعلان‌ها" />
          <DsCard padding="md" className={classNames(ds.surface.warningSoft, '!shadow-sm')}>
            <div className="mb-3 flex items-center gap-2">
              <BellIcon className="h-5 w-5 text-amber-600" />
              <p className={ds.type.cardTitle}>
                {item.data.items.length.toLocaleString('fa-IR')} پیام جدید
              </p>
            </div>
            <ul className="space-y-2">
              {item.data.items.slice(0, 3).map((alert, index) => (
                <li key={index} className="rounded-lg bg-white px-3 py-2.5">
                  <p className={ds.type.cardTitle}>{alert.title}</p>
                  {alert.description && (
                    <p className={classNames(ds.type.caption, 'mt-0.5 line-clamp-2')}>{alert.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </DsCard>
        </section>
      );

    case 'appointments_list':
      return <AppointmentsFeedItem data={item.data} />;

    case 'reviews_list':
      return <ReviewsFeedItem data={item.data} />;

    case 'loading':
      if (item.data.variant === 'appointment') {
        return (
          <section className="min-h-[60vh]">
            <div className="mb-3 flex items-start justify-between gap-2">
              <Skeleton h="0.875rem" w="5.5rem" rounded="full" />
              <Skeleton h="0.75rem" w="3.5rem" rounded="full" />
            </div>
            <div className="relative">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className="relative flex gap-4 pb-1">
                  <div className="flex w-6 shrink-0 flex-col items-center">
                    <Skeleton h="1.5rem" w="1.5rem" rounded="full" />
                    {idx < 3 && (
                      <div className="mt-1 min-h-[3.5rem] flex-1 border-r-2 border-dashed border-slate-100" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-4">
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-1 flex-col gap-2">
                          <Skeleton h="0.875rem" w="50%" rounded="full" />
                          <Skeleton h="0.75rem" w="35%" rounded="full" />
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <Skeleton h="1rem" w="3rem" rounded="full" />
                          <Skeleton h="1.25rem" w="2.75rem" rounded="full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
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
