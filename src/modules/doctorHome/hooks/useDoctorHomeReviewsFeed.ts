import { useGetReview } from '@/common/apis/services/reviews/getReviews';
import { UserInfo } from '@/modules/login/store/userInfo';
import { getTehranDayUtcBounds } from '@/common/utils/nocodbDateFilter';
import { useMemo } from 'react';
import { useAnsweredFeedbackIds } from '../apis/reviewInteractions';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { useSelectedDateStore } from '../store/selectedDate';
import { DoctorHomeFeedReview } from '../types/feed';
import { filterReviewsBySelectedCenter, filterReviewsBySelectedDate, mapRawReviewToFeed } from '../utils/normalizeReview';
import { doctorHomeListQueryDefaults } from '../utils/doctorHomeQuery';
import { useDoctorHomeContext } from './useDoctorHomeContext';

const MAX_FEED_REVIEWS = 5;

export const useDoctorHomeReviewsFeed = (user?: UserInfo) => {
  const { isDoctor, slug } = useDoctorHomeContext(user);
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const selectedCenterId = useSelectedCenterStore(state => state.selectedCenterId);
  const createdAtBounds = useMemo(() => getTehranDayUtcBounds(selectedDate), [selectedDate]);

  const reviews = useGetReview(
    {
      slug,
      sort: 'created_at',
      offset: 0,
      limit: 30,
      createdAtFrom: createdAtBounds.from,
      createdAtTo: createdAtBounds.to,
      ...(selectedCenterId ? { center_id: selectedCenterId } : {}),
    },
    {
      enabled: isDoctor && !!slug,
      ...doctorHomeListQueryDefaults,
    },
  );

  const { data: answeredIdList } = useAnsweredFeedbackIds(slug);
  // Tolerate legacy persisted cache shapes (Set → {} after JSON, or Set itself).
  const answeredIds = useMemo(() => {
    if (answeredIdList instanceof Set) return answeredIdList as Set<string>;
    if (Array.isArray(answeredIdList)) return new Set(answeredIdList);
    return new Set<string>();
  }, [answeredIdList]);

  const items = useMemo(() => {
    if (!isDoctor || !reviews.data?.list) return [] as DoctorHomeFeedReview[];

    const dayReviews = filterReviewsBySelectedDate(
      filterReviewsBySelectedCenter(reviews.data.list as Array<Record<string, unknown>>, selectedCenterId),
      selectedDate,
    );

    return dayReviews
      .map(item => mapRawReviewToFeed(item, slug, { selectedDate }))
      .filter(review => review.id == null || !answeredIds.has(String(review.id)))
      .slice(0, MAX_FEED_REVIEWS);
  }, [isDoctor, reviews.data?.list, selectedCenterId, selectedDate, slug, answeredIds]);

  return {
    isDoctor,
    slug,
    items,
    isInitialLoading: reviews.isLoading && reviews.data == null,
    doctorUserId: user?.id != null ? String(user.id) : undefined,
  };
};
