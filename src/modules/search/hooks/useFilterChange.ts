import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearchRouting } from './useSearchRouting';

export const useFilterChange = () => {
  const {
    query: { params, ...queries },
    ...router
  } = useRouter();
  const [filters, setFilters] = useState<Record<string, any>>(queries);
  const { changeRoute } = useSearchRouting();

  useEffect(() => {
    setFilters({ ...queries });
  }, [router.asPath]);

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
