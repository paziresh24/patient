import { UserInfo } from '@/modules/login/store/userInfo';
import { useMemo } from 'react';
import { useAnsweredFeedbackIds } from '../apis/reviewInteractions';
import { DoctorHomeFeedItem } from '../types/feed';
import { filterReviewsBySelectedCenter, filterReviewsBySelectedDate, mapRawReviewToFeed } from '../utils/normalizeReview';
import { dedupeNotifications } from '../utils/dedupeNotifications';
import { filterNotificationsBySelectedDate, getNotificationGregorianDateSet } from '../utils/normalizeNotification';
import { useSelectedDateStore } from '../store/selectedDate';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { shouldShowOnlineVisitSection } from '../utils/centers';
import { useDoctorHomeData } from './useDoctorHomeData';

const MAX_FEED_REVIEWS = 5;

export const useDoctorHomeFeed = (user?: UserInfo) => {
  const data = useDoctorHomeData(user);
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const selectedCenterId = useSelectedCenterStore(state => state.selectedCenterId);
  const { data: answeredIds } = useAnsweredFeedbackIds(data.slug);

  const items = useMemo(() => {
    if (!data.isDoctor) return [] as DoctorHomeFeedItem[];

    const feed: DoctorHomeFeedItem[] = [
      {
        id: 'stats',
        type: 'stats',
        data: { ...data.stats, slug: data.slug },
      },
    ];

    const filteredNotifications = filterNotificationsBySelectedDate(
      dedupeNotifications(data.notifications),
      selectedDate,
    );

    if (filteredNotifications.length > 0) {
      feed.push({
        id: 'alerts',
        type: 'alerts',
        data: { items: filteredNotifications },
      });
    }

    feed.push({
      id: 'actions',
      type: 'actions',
      data: {
        ...(shouldShowOnlineVisitSection(selectedCenterId)
          ? {
              onlineVisit: {
                userCenterId: data.onlineVisitUserCenterId,
                hasOnlineVisitCenter: data.hasOnlineVisitCenter,
              },
            }
          : {}),
      },
    });

    feed.push({
      id: 'appointments-list',
      type: 'appointments_list',
      data: {
        items: data.appointments.items,
        todayCount: data.appointments.todayCount,
        isTodayCountLoading: data.stats.isTodayCountLoading,
        isAppointmentsLoading: data.appointments.isLoading,
        isAppointmentsFetching: data.appointments.isFetching,
      },
    });

    if (data.reviews.isLoading) {
      feed.push({ id: 'loading-reviews', type: 'loading', data: { variant: 'review' } });
    } else {
      const dayReviews = filterReviewsBySelectedDate(
        filterReviewsBySelectedCenter(data.reviews.items as Array<Record<string, unknown>>, selectedCenterId),
        selectedDate,
      );
      const unanswered = dayReviews
        .map(item => mapRawReviewToFeed(item, data.slug, { selectedDate }))
        .filter(r => r.id == null || !(answeredIds?.has(String(r.id)) ?? false))
        .slice(0, MAX_FEED_REVIEWS);

      if (unanswered.length > 0) {
        feed.push({
          id: 'reviews-list',
          type: 'reviews_list',
          data: {
            items: unanswered,
            slug: data.slug,
            doctorUserId: user?.id != null ? String(user.id) : undefined,
          },
        });
      }
    }

    return feed;
  }, [data, answeredIds, user?.id, selectedDate, selectedCenterId]);

  const notificationDateSet = useMemo(
    () => getNotificationGregorianDateSet(dedupeNotifications(data.notifications)),
    [data.notifications],
  );

  return { items, isDoctor: data.isDoctor, notificationDateSet };
};
