import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import chunk from 'lodash/chunk';
import { useMemo } from 'react';
import { useSearch } from '../../hooks/useSearch';
import consult from './consult';
import office from './office';

export const Onboard = () => {
  const { isConsult } = useSearch();

  const data = useMemo(() => (isConsult ? consult : office), [isConsult]);

  return (
    <div className="flex flex-col space-y-4">
      <Text as="h2" fontSize="sm" fontWeight="semiBold">
        {isConsult ? 'چگونه مشاوره آنلاین بگیرم؟' : 'چطور با پذیرش24 درمان شوم؟'}
      </Text>
      <div className="flex flex-col p-4 pr-12 space-y-3 bg-white rounded-lg md:space-s-24 md:flex-row">
        {chunk(data, 3).map((items, allIndex, allSelf) => (
          <div key={allIndex} className="flex flex-col h-full space-y-3">
            {items.map((item, index, self) => (
              <div
                key={index}
                className={clsx(
                  'relative inline-flex flex-col md:min-h-[3rem] space-y-1 before:content before:border before:top-8 before:bottom-0 before:bg-slate-800 before:-right-6 before:rounded-full before:border-slate-800 before:absolute',
                  {
                    'before:hidden': allIndex === allSelf.length - 1 && index === self.length - 1,
                  },
                )}
              >
                <div className="absolute top-0 -right-9">{(item as any)?.icon}</div>
                <Text fontSize="sm" fontWeight="bold">
                  {item.title}
                </Text>
                <Text fontSize="xs">{item.description}</Text>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Onboard;
