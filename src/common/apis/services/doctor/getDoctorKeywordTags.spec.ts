import { getDoctorKeywordTags } from './getDoctorKeywordTags';

jest.mock('@/common/apis/client', () => ({
  searchClient: {
    get: jest.fn(),
  },
}));

const { searchClient } = jest.requireMock('@/common/apis/client') as {
  searchClient: { get: jest.Mock };
};

describe('getDoctorKeywordTags', () => {
  beforeEach(() => {
    searchClient.get.mockReset();
  });

  it('returns keyword_tags_user_priority_1 for matching doctor slug', async () => {
    searchClient.get.mockResolvedValue({
      data: {
        search: {
          result: [
            {
              url: '/dr/دکتر-محدثه-بشارتی/',
              slug: 'دکتر-محدثه-بشارتی',
              keyword_tags_user_priority_1: ['بیماری های زنان', 'زایمان', 'جراحی زیبایی واژن زنان'],
            },
          ],
        },
      },
    });

    await expect(
      getDoctorKeywordTags({
        slug: 'دکتر-محدثه-بشارتی',
        searchText: 'محدثه بشارتی',
        cityEnSlug: 'yazd',
      }),
    ).resolves.toEqual(['بیماری های زنان', 'زایمان', 'جراحی زیبایی واژن زنان']);

    expect(searchClient.get).toHaveBeenCalledWith('/seapi/v1/search/yazd', {
      params: { text: 'محدثه بشارتی' },
      timeout: 2500,
    });
  });

  it('falls back to ir when city search has no matching tags', async () => {
    searchClient.get
      .mockResolvedValueOnce({
        data: { search: { result: [{ url: '/dr/someone-else/', keyword_tags_user_priority_1: ['x'] }] } },
      })
      .mockResolvedValueOnce({
        data: {
          search: {
            result: [
              {
                url: '/dr/دکتر-محدثه-بشارتی/',
                keyword_tags_user_priority_1: ['بیماری های زنان', 'زایمان'],
              },
            ],
          },
        },
      });

    await expect(
      getDoctorKeywordTags({
        slug: 'دکتر-محدثه-بشارتی',
        searchText: 'محدثه بشارتی',
        cityEnSlug: 'meybod',
      }),
    ).resolves.toEqual(['بیماری های زنان', 'زایمان']);

    expect(searchClient.get).toHaveBeenNthCalledWith(1, '/seapi/v1/search/meybod', expect.any(Object));
    expect(searchClient.get).toHaveBeenNthCalledWith(2, '/seapi/v1/search/ir', expect.any(Object));
  });

  it('returns empty array when search fails', async () => {
    searchClient.get.mockRejectedValue(new Error('down'));
    await expect(getDoctorKeywordTags({ slug: 'دکتر-تست' })).resolves.toEqual([]);
  });
});
