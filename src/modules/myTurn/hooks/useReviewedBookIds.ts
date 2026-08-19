import { fetchMyFeedbacks } from '@/modules/rate-and-review/api';
import { useQuery } from '@tanstack/react-query';

const FEEDBACKS_PAGE_SIZE = 50;
const MAX_FEEDBACK_PAGES = 20;

export const fetchReviewedBookIds = async () => {
  const bookIds = new Set<string>();
  let offset = 0;

  for (let page = 0; page < MAX_FEEDBACK_PAGES; page += 1) {
    const result = await fetchMyFeedbacks({ limit: FEEDBACKS_PAGE_SIZE, offset });

    result.data.forEach(feedback => {
      const bookId = String(feedback.book_id ?? '').trim();
      if (bookId) bookIds.add(bookId);
    });

    if (!result.meta.hasNext || result.meta.nextOffset == null) break;
    offset = result.meta.nextOffset;
  }

  return Array.from(bookIds);
};

export const useReviewedBookIds = (userId?: string | number) =>
  useQuery(['patient-reviewed-book-ids', userId], fetchReviewedBookIds, {
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000,
  });
