import uniqBy from 'lodash/uniqBy';
import { useEffect, useState } from 'react';
import { Item } from '../types/suggestion';

export const useRecentSearch = () => {
  const [recent, setRecent] = useState<Item[]>([]);
  useEffect(() => {
    const formattedHistory: Array<{ name?: string }> = uniqBy(JSON.parse(localStorage.getItem('history') ?? '[]') as Item[], 'name')
      .reverse()
      .slice(0, 4)
      .filter((item: any) => item?.name);
    setRecent(formattedHistory);
  }, []);

  const addRecentSearch = (item: Item) => {
    const history = uniqBy(JSON.parse(localStorage.getItem('history') ?? '[]') as Item[], 'name');
    const newHistory = history.filter(historyItem => historyItem.name !== item.name);
    localStorage.setItem('history', JSON.stringify([...newHistory, item]));
  };

  return { recent, addRecentSearch };
};
