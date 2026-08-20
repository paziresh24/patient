import { fetchMyFeedbacks } from '@/modules/rate-and-review/api';
import { fetchReviewedBookIds } from './useReviewedBookIds';

jest.mock('@/modules/rate-and-review/api', () => ({
  fetchMyFeedbacks: jest.fn(),
}));

const mockedFetchMyFeedbacks = fetchMyFeedbacks as jest.MockedFunction<typeof fetchMyFeedbacks>;

describe('fetchReviewedBookIds', () => {
  it('collects reviewed appointment ids from every feedback page', async () => {
    mockedFetchMyFeedbacks
      .mockResolvedValueOnce({
        data: [{ id: 1, book_id: 'book-1' }, { id: 2, book_id: null }],
        meta: { userId: 10, count: 2, limit: 50, offset: 0, total: 3, hasNext: true, nextOffset: 50 },
      })
      .mockResolvedValueOnce({
        data: [{ id: 3, book_id: 200 }],
        meta: { userId: 10, count: 1, limit: 50, offset: 50, total: 3, hasNext: false, nextOffset: null },
      });

    await expect(fetchReviewedBookIds()).resolves.toEqual(['book-1', '200']);
    expect(mockedFetchMyFeedbacks).toHaveBeenNthCalledWith(1, { limit: 50, offset: 0 });
    expect(mockedFetchMyFeedbacks).toHaveBeenNthCalledWith(2, { limit: 50, offset: 50 });
  });
});
