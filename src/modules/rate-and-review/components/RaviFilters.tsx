import SearchIcon from '@/common/components/icons/search';
import { useMemo } from 'react';
import { RaviCenter, RaviSort } from '../types';
import { RaviComboSelect } from './RaviComboSelect';

interface RaviFiltersProps {
  sort: RaviSort;
  filterValue: string;
  search: string;
  centers?: RaviCenter[];
  onSort: (value: RaviSort) => void;
  onFilter: (value: string) => void;
  onSearch: (value: string) => void;
}

const fieldShell =
  'relative flex min-h-[42px] w-full items-center rounded-xl border border-[#dbdbd7] bg-white px-3 py-2.5 transition-colors hover:border-[#c8c7c1] focus-within:border-[#c8c7c1] focus-within:shadow-[0_0_0_3px_#96c7f2]';

export const RaviFilters = ({
  sort,
  filterValue,
  search,
  centers = [],
  onSort,
  onFilter,
  onSearch,
}: RaviFiltersProps) => {
  const sortOptions = useMemo(
    () => [
      { value: 'default_order', label: 'مرتبط‌ترین' },
      { value: 'created_at', label: 'جدیدترین' },
    ],
    [],
  );

  const filterOptions = useMemo(
    () => [
      { value: 'all', label: 'همه نظرات' },
      { value: 'not_recommended', label: 'نظرات منفی' },
      ...centers.map(center => ({ value: center.id, label: center.name })),
    ],
    [centers],
  );

  return (
    <div className="flex w-full flex-col gap-3" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        <RaviComboSelect value={sort} options={sortOptions} onChange={value => onSort(value as RaviSort)} />
        <RaviComboSelect value={filterValue} options={filterOptions} onChange={onFilter} />
      </div>

      <div className={fieldShell}>
        <input
          value={search}
          onChange={event => onSearch(event.target.value)}
          placeholder="جستجو در نظرات بیماران"
          className="w-full border-0 bg-transparent py-0 pl-8 pr-0 text-right text-sm text-slate-800 outline-none placeholder:text-[#706f6c]"
        />
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#90908c]" />
      </div>
    </div>
  );
};
