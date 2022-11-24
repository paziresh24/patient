import merge from 'lodash/merge';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSearch } from './useSearch';
import { useSearchRouting } from './useSearchRouting';

export const useFilterChange = () => {
  const {
    query: { params, ...queries },
    ...router
  } = useRouter();
  const { selectedFilters } = useSearch();
  const { changeRoute } = useSearchRouting();

  const filters = useMemo(() => merge(queries, selectedFilters), [router.asPath, selectedFilters]);

  const removeFilter = (name: string) => {
    delete queries[name];
    delete queries.page;
    changeRoute({
      query: { ...queries },
      previousQueries: false,
    });
  };

  const handleChange = (name: string, value: string | boolean | string[]) => {
    delete queries.page;
    let newQueries;
    if (typeof value === 'boolean' && !value) {
      delete queries[name];
      newQueries = {
        ...queries,
      };
    } else {
      newQueries = {
        ...queries,
        [name]: value,
      };
    }
    changeRoute({
      query: { ...newQueries },
      previousQueries: false,
    });
  };

  return { handleChange, filters, removeFilter };
};
