import { RaviReview } from '@/modules/rate-and-review';
import { DoctorHomeFeedReview } from '../types/feed';

export const mapFeedReviewToRaviReview = (review: DoctorHomeFeedReview): RaviReview => ({
  id: String(review.id ?? ''),
  userId: review.userId != null ? String(review.userId) : undefined,
  userName: review.userName,
  description: String(review.description ?? ''),
  dateLabel: review.relativeCreatedTime ?? '—',
  centerName: review.centerName,
  visited: !!review.visited,
  rate: review.rate ?? null,
  likeCount: review.likeCount,
});
