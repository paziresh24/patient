import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchReviewPage, PAGE_SIZE } from '../api';
import { RaviReviewFilterValue, RaviReviewPage, RaviReviewPageInfo, RaviReviewQuery, RaviSort } from '../types';
import { resolveFeedbackApiFilter } from '../utils/resolveFeedbackFilter';

interface DoctorState {
  list: RaviReviewPage['list'];
  hasMore: boolean;
  pageInfo?: RaviReviewPageInfo;
  sort: RaviSort;
  filter: RaviReviewFilterValue;
  page: number;
}

const INITIAL_FILTER: RaviReviewFilterValue = { type: 'all' };

export const useRaviReviews = (doctorSlug: string, userId?: string) => {
  const stateBySlugRef = useRef<Record<string, DoctorState>>({});
  const [list, setList] = useState<RaviReviewPage['list']>([]);
  const [hasMore, setHasMore] = useState(false);
  const [pageInfo, setPageInfo] = useState<RaviReviewPageInfo | undefined>();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [sort, setSort] = useState<RaviSort>('default_order');
  const [filter, setFilter] = useState<RaviReviewFilterValue>(INITIAL_FILTER);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toQuery = useCallback(
    (nextPage: number, nextSort: RaviSort, nextFilter: RaviReviewFilterValue): RaviReviewQuery => {
      const query: RaviReviewQuery = {
        offset: (nextPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        filter: resolveFeedbackApiFilter(nextSort, nextFilter),
      };

      if (nextFilter.type === 'my_feedbacks' && (nextFilter.value ?? userId)) {
        query.userId = nextFilter.value ?? userId;
      } else if (nextFilter.type === 'center_id' && nextFilter.value) {
        query.centerId = nextFilter.value;
      }

      return query;
    },
    [userId],
  );

  const run = useCallback(
    async (nextPage: number, nextSort: RaviSort, nextFilter: RaviReviewFilterValue, append: boolean) => {
      if (!doctorSlug) return;

      setIsLoading(true);
      setError(null);
      try {
        const pageData = await fetchReviewPage(doctorSlug, toQuery(nextPage, nextSort, nextFilter));
        const previousList = append ? (stateBySlugRef.current[doctorSlug]?.list ?? []) : [];
        const nextList = append ? [...previousList, ...pageData.list] : pageData.list;

        setList(nextList);
        setHasMore(pageData.hasMore);
        setPageInfo(pageData.pageInfo);
        setPage(nextPage);
        setSort(nextSort);
        setFilter(nextFilter);

        stateBySlugRef.current[doctorSlug] = {
          list: nextList,
          hasMore: pageData.hasMore,
          pageInfo: pageData.pageInfo,
          sort: nextSort,
          filter: nextFilter,
          page: nextPage,
        };
      } catch (e) {
        setError(e instanceof Error ? e.message : 'خطا در دریافت نظرات');
      } finally {
        setIsLoading(false);
      }
    },
    [doctorSlug, toQuery],
  );

  const applyDebouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setIsSearchPending(false);
      }, 250),
    [],
  );

  useEffect(() => () => applyDebouncedSearch.cancel(), [applyDebouncedSearch]);

  useEffect(() => {
    if (!doctorSlug) return;

    applyDebouncedSearch.cancel();
    setSearch('');
    setDebouncedSearch('');
    setIsSearchPending(false);

    const cached = stateBySlugRef.current[doctorSlug];
    if (cached) {
      setList(cached.list);
      setHasMore(cached.hasMore);
      setPageInfo(cached.pageInfo);
      setSort(cached.sort);
      setFilter(cached.filter);
      setPage(cached.page);
      return;
    }

    run(1, 'default_order', INITIAL_FILTER, false);
  }, [doctorSlug, run, applyDebouncedSearch]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    run(page + 1, sort, filter, true);
  }, [filter, hasMore, isLoading, page, run, sort]);

  const onSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setIsSearchPending(true);
      applyDebouncedSearch(value);
    },
    [applyDebouncedSearch],
  );

  const onSort = useCallback(
    (value: RaviSort) => {
      applyDebouncedSearch.cancel();
      setIsSearchPending(false);
      setSort(value);
      run(1, value, filter, false);
    },
    [applyDebouncedSearch, filter, run],
  );

  const onFilter = useCallback(
    (value: RaviReviewFilterValue) => {
      applyDebouncedSearch.cancel();
      setIsSearchPending(false);
      setFilter(value);
      run(1, sort, value, false);
    },
    [applyDebouncedSearch, run, sort],
  );

  const syncList = useCallback(
    (
      updater:
        | RaviReviewPage['list']
        | ((previous: RaviReviewPage['list']) => RaviReviewPage['list']),
    ) => {
      setList(previous => {
        const nextList = typeof updater === 'function' ? updater(previous) : updater;
        const cached = stateBySlugRef.current[doctorSlug];
        if (cached) {
          stateBySlugRef.current[doctorSlug] = { ...cached, list: nextList };
        }
        return nextList;
      });
    },
    [doctorSlug],
  );

  const removeReview = useCallback(
    (reviewId: string) => {
      syncList(previous => previous.filter(item => String(item.id ?? item.Id ?? '') !== reviewId));
    },
    [syncList],
  );

  const updateReviewDescription = useCallback(
    (reviewId: string, description: string) => {
      syncList(previous =>
        previous.map(item => {
          const id = String(item.id ?? item.Id ?? '');
          return id === reviewId ? { ...item, description } : item;
        }),
      );
    },
    [syncList],
  );

  return {
    list,
    hasMore,
    page,
    isLoading,
    isSearchPending,
    error,
    search,
    debouncedSearch,
    sort,
    filter,
    loadMore,
    onSearch,
    onSort,
    onFilter,
    removeReview,
    updateReviewDescription,
  };
};
