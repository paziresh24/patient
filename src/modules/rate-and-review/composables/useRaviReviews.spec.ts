import { act, renderHook, waitFor } from '@testing-library/react';
import { useRaviReviews } from './useRaviReviews';
import { fetchReviewPage } from '../api';

jest.mock('../api', () => ({
  fetchReviewPage: jest.fn(),
  PAGE_SIZE: 10,
}));

const mockedFetchReviewPage = fetchReviewPage as jest.MockedFunction<typeof fetchReviewPage>;

describe('useRaviReviews slug changes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchReviewPage.mockImplementation(async (slug, query) => ({
      list: [{ id: slug, description: `review for ${slug}`, offset: query.offset }],
      hasMore: false,
      pageInfo: { isLastPage: true },
    }));
  });

  it('resets search when doctor slug changes', async () => {
    const { result, rerender } = renderHook(
      ({ slug }) => useRaviReviews(slug),
      { initialProps: { slug: 'dr-a' } },
    );

    await waitFor(() => expect(result.current.list).toHaveLength(1));

    act(() => {
      result.current.onSearch('keep-me');
    });
    expect(result.current.search).toBe('keep-me');

    rerender({ slug: 'dr-b' });

    await waitFor(() => {
      expect(result.current.search).toBe('');
      expect(result.current.debouncedSearch).toBe('');
    });
    expect(mockedFetchReviewPage).toHaveBeenLastCalledWith(
      'dr-b',
      expect.objectContaining({ filter: 'default', offset: 0 }),
    );
  });
});
