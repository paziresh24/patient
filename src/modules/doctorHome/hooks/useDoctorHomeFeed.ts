import { UserInfo } from '@/modules/login/store/userInfo';
import { useMemo } from 'react';
import { useAnsweredFeedbackIds } from '../apis/reviewInteractions';
import { DoctorHomeFeedItem } from '../types/feed';
import { mapRawReviewToFeed } from '../utils/normalizeReview';
import { useDoctorHomeData } from './useDoctorHomeData';

const MAX_FEED_REVIEWS = 5;

export const useDoctorHomeFeed = (user?: UserInfo) => {
  const data = useDoctorHomeData(user);
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

    if (data.notifications.length === 1) {
      feed.push({
        id: 'alert-0',
        type: 'alert',
        data: {
          title: data.notifications[0].title,
          description: data.notifications[0].description,
        },
      });
    } else if (data.notifications.length > 1) {
      feed.push({
        id: 'alerts',
        type: 'alerts',
        data: { items: data.notifications },
      });
    }

    if (data.appointments.isLoading) {
      feed.push({ id: 'loading-appointments', type: 'loading', data: { variant: 'appointment' } });
    } else if (data.appointments.isError && data.appointments.items.length === 0) {
      feed.push({
        id: 'empty-appointments-api',
        type: 'empty',
        data: {
          message: 'بارگذاری نوبت‌های امروز ممکن نشد.',
          href: '/dashboard/apps/drapp/appointments/',
          linkLabel: 'مشاهده مراجعین من',
        },
      });
    } else if (data.appointments.items.length > 0) {
      feed.push({
        id: 'appointments-list',
        type: 'appointments_list',
        data: {
          items: data.appointments.items,
          todayCount: data.appointments.todayCount,
        },
      });
    } else if (!data.appointments.isLoading) {
      feed.push({
        id: 'empty-appointments',
        type: 'empty',
        data: { message: 'نوبت پیش‌رویی ندارید.' },
      });
    }

    feed.push({
      id: 'online_visit',
      type: 'online_visit',
      data: {
        userCenterId: data.onlineVisitUserCenterId,
        hasOnlineVisitCenter: data.hasOnlineVisitCenter,
      },
    });

    if (data.reviews.isLoading) {
      feed.push({ id: 'loading-reviews', type: 'loading', data: { variant: 'review' } });
    } else if (data.reviews.items.length > 0) {
      // فقط نظرهای بی‌پاسخِ جدید — به‌ترتیب ثبت (API مرتب‌شده برمی‌گردونه) و حداکثر ۵ تا
      const unanswered = (data.reviews.items as Array<Record<string, unknown>>)
        .map(item => mapRawReviewToFeed(item, data.slug))
        .filter(r => r.id == null || !(answeredIds?.has(String(r.id)) ?? false))
        .slice(0, MAX_FEED_REVIEWS);

      feed.push({
        id: 'reviews-list',
        type: 'reviews_list',
        data: {
          items: unanswered,
          slug: data.slug,
          doctorUserId: user?.id != null ? String(user.id) : undefined,
        },
      });
    } else if (!data.reviews.isLoading) {
      feed.push({
        id: 'empty-reviews',
        type: 'empty',
        data: { message: 'هنوز نظری ثبت نشده است.' },
      });
    }

    return feed;
  }, [data, answeredIds, user?.id]);

  return { items, isDoctor: data.isDoctor };
};
