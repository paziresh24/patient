jest.mock('../composables/useRaviReviews', () => ({
  useRaviReviews: jest.fn(),
}));

jest.mock('./RaviCard', () => ({
  RaviCard: ({ review }: { review: { description: string } }) => {
    const React = require('react');
    return React.createElement('div', null, review.description);
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { RaviList } from './RaviList';
import { useRaviReviews } from '../composables/useRaviReviews';

const mockedUseRaviReviews = useRaviReviews as jest.MockedFunction<typeof useRaviReviews>;

const sampleList = [
  {
    id: '1',
    description: 'پزشک بسیار دلسوز بود',
    user_display_name: 'علی',
    center_name: 'کلینیک',
    visit_status: 'visited',
    avg_rate_value: 4.5,
    relativeCreatedTime: 'دیروز',
  },
  {
    id: '2',
    description: 'انتظار طولانی',
    user_display_name: 'مریم',
    center_name: 'بیمارستان',
    visit_status: 'not_visited',
    avg_rate_value: 3.8,
    relativeCreatedTime: 'هفته پیش',
  },
];

const baseHookState = {
  list: sampleList,
  hasMore: true,
  page: 1,
  isLoading: false,
  isSearchPending: false,
  error: null,
  search: '',
  debouncedSearch: '',
  sort: 'default_order' as const,
  filter: { type: 'all' as const },
  loadMore: jest.fn(),
  retry: jest.fn(),
  onSearch: jest.fn(),
  onSort: jest.fn(),
  onFilter: jest.fn(),
  removeReview: jest.fn(),
  updateReviewDescription: jest.fn(),
};

describe('RaviList user flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRaviReviews.mockReturnValue(baseHookState);
  });

  it('renders loaded reviews for the user', () => {
    render(<RaviList doctorSlug="dr-test" />);

    expect(screen.getByText('پزشک بسیار دلسوز بود')).toBeInTheDocument();
    expect(screen.getByText('انتظار طولانی')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'نمایش بیشتر' })).toBeInTheDocument();
  });

  it('keeps reviews visible while search is pending', () => {
    mockedUseRaviReviews.mockReturnValue({
      ...baseHookState,
      search: 'دلسوز',
      isSearchPending: true,
      debouncedSearch: '',
    });

    render(<RaviList doctorSlug="dr-test" />);

    expect(screen.getByText('پزشک بسیار دلسوز بود')).toBeInTheDocument();
    expect(screen.getByText('انتظار طولانی')).toBeInTheDocument();
    expect(screen.queryByText('در حال جستجو...')).not.toBeInTheDocument();
  });

  it('shows empty search result message without hiding other reviews context', () => {
    mockedUseRaviReviews.mockReturnValue({
      ...baseHookState,
      debouncedSearch: 'xyz-not-found',
    });

    render(<RaviList doctorSlug="dr-test" />);

    expect(screen.getByText('نتیجه‌ای برای جستجوی شما یافت نشد.')).toBeInTheDocument();
    expect(screen.queryByText('پزشک بسیار دلسوز بود')).not.toBeInTheDocument();
  });

  it('shows search scope hint when more pages exist', () => {
    mockedUseRaviReviews.mockReturnValue({
      ...baseHookState,
      debouncedSearch: 'دلسوز',
      hasMore: true,
    });

    render(<RaviList doctorSlug="dr-test" />);

    expect(screen.getByText('جستجو فقط در نظرات بارگذاری‌شده انجام می‌شود.')).toBeInTheDocument();
  });

  it('calls onSearch when user types in search field', () => {
    const onSearch = jest.fn();
    mockedUseRaviReviews.mockReturnValue({ ...baseHookState, onSearch });

    render(<RaviList doctorSlug="dr-test" />);
    fireEvent.change(screen.getByPlaceholderText('جستجو در نظرات بیماران'), {
      target: { value: 'علی' },
    });

    expect(onSearch).toHaveBeenCalledWith('علی');
  });

  it('shows fixed error message and retries on button click', () => {
    const retry = jest.fn();
    mockedUseRaviReviews.mockReturnValue({
      ...baseHookState,
      list: [],
      hasMore: false,
      error: 'خطا در دریافت نظرات',
      retry,
    });

    render(<RaviList doctorSlug="dr-test" />);

    expect(screen.getByText('خطا در دریافت نظرات')).toBeInTheDocument();
    expect(screen.queryByText('نظری ثبت نشده است.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'تلاش مجدد' }));
    expect(retry).toHaveBeenCalled();
  });
});
