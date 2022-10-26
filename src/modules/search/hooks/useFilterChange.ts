import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useFilterChange = () => {
  const {
    query: { params, ...queries },
    ...router
  } = useRouter();
  const [filters, setFilters] = useState<Record<string, any>>(queries);

  useEffect(() => {
    setFilters({ ...queries });
  }, [router.asPath]);

  const removeFilter = (name: string) => {
    delete queries[name];
    delete queries.page;
    router.push(
      {
        pathname: (params as string[])?.join('/') ?? '',
        query: {
          ...queries,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      },
    );
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
    router.push(
      {
        pathname: (params as string[])?.join('/') ?? '',
        query: {
          ...newQueries,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      },
    );
  };

  return { handleChange, filters, removeFilter };
};
