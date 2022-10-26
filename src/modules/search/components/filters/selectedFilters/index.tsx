import Button from '@/common/components/atom/button';
import Chips from '@/common/components/atom/chips';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { useFilterChange } from '../../../hooks/useFilterChange';
import { freeturnItems } from '../sort';

interface CategoriesProps {
  isLoading: boolean;
}

export const SelectedFilters = (props: CategoriesProps) => {
  const { isLoading } = props;
  const { categories, filters, selectedFilters } = useSearch();
  const selectedCategory = useMemo(() => categories?.find(item => item.value === selectedFilters?.category), [selectedFilters]);

  const {
    query: { params },
    ...router
  } = useRouter();
  const { removeFilter } = useFilterChange();

  const getFilterTitle = (name: string, value: string) => {
    if (!name || !value) return;
    if (name === 'category') return selectedCategory?.title ?? '';
    if (name === 'sub_category') {
      return selectedCategory?.sub_categories?.find(item => item.value === `exp-${value.replace('exp-', '')}`)?.title ?? '';
    }
    if (name === 'text') return value;
    if (name === 'freeturn')
      return freeturnItems[value as 'all' | 'today' | 'tomorrow' | 'nextThreeDays' | 'nextFiveDays' | 'nextSevenDays'];

    return filters.find(item => item.name === name)?.items
      ? filters.find(item => item.name === name)?.items?.find(item => item.value === value)?.title
      : filters.find(item => item.name === name)?.title ?? null;
  };

  const handleRemoveFilter = (name: string) => {
    if (name === 'sub_category') {
      return removeFilter('expertise');
    }
    if (name === 'category') {
      return router.push(
        {
          pathname: (params as string[])[0],
        },
        undefined,
        {
          shallow: true,
          scroll: true,
        },
      );
    }
    removeFilter(name);
  };

  const handleRemoveAllFilters = () => {
    router.push((params as string[])[0], undefined, { shallow: true });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg md:p-5 md:space-y-5 md:bg-white md:shadow-card">
      <div className="items-center justify-between hidden md:flex">
        <Text fontWeight="bold">فیلتر های انتخاب شده</Text>
        <Button
          onClick={handleRemoveAllFilters}
          size="sm"
          variant="text"
          className="!h-6 rounded-full text-red-600 hover:bg-red-50 flex justify-center items-center"
        >
          حذف
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {isLoading && <Loading />}
        {!isLoading &&
          Object.entries(selectedFilters).map(([name, value]) => (
            <Fragment key={name}>
              {Array.isArray(value) &&
                value &&
                value?.map(item => (
                  <Chips
                    key={item}
                    handleRemove={() => handleRemoveFilter(name)}
                    className="!text-slate-500 !bg-white md:!bg-slate-100 !text-sm cursor-pointer"
                  >
                    {getFilterTitle(name, item)}
                  </Chips>
                ))}
              {!Array.isArray(value) && name !== 'city' && getFilterTitle(name, value) && (
                <Chips
                  handleRemove={() => handleRemoveFilter(name)}
                  className="!text-slate-500 !bg-white md:!bg-slate-100 !text-sm cursor-pointer"
                >
                  {getFilterTitle(name, value)}
                </Chips>
              )}
            </Fragment>
          ))}
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <>
      <Skeleton w="6rem" h="1.75rem" rounded="full" />
      <Skeleton w="8rem" h="1.75rem" rounded="full" />
      <Skeleton w="3rem" h="1.75rem" rounded="full" />
    </>
  );
};

export default SelectedFilters;
