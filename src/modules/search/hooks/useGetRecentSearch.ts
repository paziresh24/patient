import { useEffect, useState } from 'react';

export const useGetRecentSearch = () => {
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    const formmatedHistory: [] = JSON.parse(localStorage.getItem('history') ?? '[]')
      .reverse()
      .slice(0, 4);
    setRecent(formmatedHistory);
  }, []);

  return recent;
};
