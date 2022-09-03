import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';

export const useGetRecentSearch = () => {
  const [recent, setRecent] = useState<Array<{ name?: string }>>([]);
  useEffect(() => {
    const formmatedHistory: Array<{ name?: string }> = uniqBy(JSON.parse(localStorage.getItem('history') ?? '[]') as [], 'name')
      .reverse()
      .slice(0, 4);
    setRecent(formmatedHistory);
  }, []);

  return recent;
};
