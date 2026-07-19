import Button from '@/common/components/atom/button/button';
import { useMemo } from 'react';
import { useRaviReviews } from '../composables/useRaviReviews';
import { RaviCenter } from '../types';
import { filterReviewsBySearch } from '../utils/filterReviews';
import { mapRawReviewToRaviReview } from '../utils/mapReview';
import { RaviCard } from './RaviCard';
import { RaviFilters } from './RaviFilters';
interface RaviListProps {
  doctorSlug: string;
  doctorUserId?: string;
  userId?: string;
  centers?: RaviCenter[];
}

export const RaviList = ({ doctorSlug, doctorUserId, userId, centers = [] }: RaviListProps) => {
  const {
    list,
    isLoading,
    isSearchPending,
    hasMore,
    loadMore,
    search,
    debouncedSearch,
    sort,
    filter,
    onSearch,
    onSort,
    onFilter,
    error,
    page,
    retry,
    removeReview,
    updateReviewDescription,
  } = useRaviReviews(doctorSlug, userId);

  const reviews = useMemo(() => list.map(mapRawReviewToRaviReview), [list]);
  const filteredReviews = useMemo(
    () => filterReviewsBySearch(reviews, debouncedSearch),
    [debouncedSearch, reviews],
  );
  const showInitialLoading = isLoading && !reviews.length;
  const showSearchLoading = isSearchPending && !reviews.length;

  const selectedFilter = (() => {
    if (filter.type === 'center_id') return filter.value ?? 'all';
    return filter.type;
  })();

  const handleFilter = (value: string) => {
    if (value === 'all') return onFilter({ type: 'all' });
    if (value === 'not_recommended') return onFilter({ type: 'not_recommended' });
    onFilter({ type: 'center_id', value });
  };

  return (
    <section className="w-full bg-white md:rounded-b-lg">
      <div className="p-4">
        <RaviFilters
          sort={sort}
          filterValue={selectedFilter}
          search={search}
          centers={centers}
          onSort={onSort}
          onFilter={handleFilter}
          onSearch={onSearch}
        />
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-3 px-4 pb-4">
          <p className="text-sm text-black">{error}</p>
          <Button
            variant="secondary"
            size="sm"
            className="!border-black !text-black hover:!bg-black/5"
            onClick={retry}
            loading={isLoading}
          >
            تلاش مجدد
          </Button>
        </div>
      ) : null}

      {debouncedSearch && hasMore ? (
        <p className="px-4 pb-2 text-xs text-slate-500">جستجو فقط در نظرات بارگذاری‌شده انجام می‌شود.</p>
      ) : null}

      {showInitialLoading || showSearchLoading ? (
        <p className="px-4 pb-4 text-sm text-slate-500">
          {showSearchLoading ? 'در حال جستجو...' : 'در حال بارگذاری نظرات...'}
        </p>
      ) : null}

      {!error && !showInitialLoading && !reviews.length ? (
        <p className="px-4 pb-4 text-sm text-slate-500">نظری ثبت نشده است.</p>
      ) : null}

      {!showInitialLoading && reviews.length > 0 && !filteredReviews.length ? (
        <p className="px-4 pb-4 text-sm text-slate-500">نتیجه‌ای برای جستجوی شما یافت نشد.</p>
      ) : null}
      <div>
        {filteredReviews.map(review => (
          <RaviCard
            key={review.id}
            review={review}
            doctorSlug={doctorSlug}
            doctorUserId={doctorUserId}
            highlightQuery={debouncedSearch}
            onDeleted={() => removeReview(review.id)}
            onEdited={description => updateReviewDescription(review.id, description)}
          />
        ))}
      </div>

      {hasMore && !error ? (
        <div className="p-4">
          <Button variant="secondary" block onClick={loadMore} loading={page > 1 && isLoading}>
            نمایش بیشتر
          </Button>
        </div>
      ) : null}
    </section>
  );
};
