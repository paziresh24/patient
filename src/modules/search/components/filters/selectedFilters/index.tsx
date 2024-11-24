import Button from '@/common/components/atom/button';
import Chips from '@/common/components/atom/chips';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { useFilterChange } from '../../../hooks/useFilterChange';
import { freeturnItems } from '../sort';
import useResponsive from '@/common/hooks/useResponsive';
interface CategoriesProps {
  isLoading: boolean;
}

export const SelectedFilters = (props: CategoriesProps) => {
  const { isLoading } = props;
  const {
    query: { params },
  } = useRouter();
  const { isMobile } = useResponsive();
  const { categories, filters, selectedFilters, searchCity } = useSearch();
  const selectedCategory = useMemo(() => categories?.find(item => item.value === selectedFilters?.category), [selectedFilters]);
  const { changeRoute } = useSearchRouting();

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

  const handleRemoveFilter = (name: string, value: string) => {
    if (
      (name === 'sub_category' && value?.startsWith('exp-')) ||
      name === 'category' ||
      (name === 'text' && (params as string[])?.[1]?.startsWith('q-')) ||
      (name === 'result_type' && ['center', 'doctor'].includes((params as string[])?.[1]))
    ) {
      return handleRemoveAllFilters();
    }
    if (name === 'sub_category') {
      return removeFilter('expertise');
    }

    removeFilter(name);
  };

  const handleRemoveAllFilters = () => {
    changeRoute({ params: { city: searchCity?.en_slug }, overWrite: true });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-full md:rounded-lg md:p-5 md:space-y-5 md:bg-white md:shadow-card">
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
      <div className="flex gap-2 overflow-auto no-scroll md:flex-wrap">
        {isLoading && <Loading />}
        {!isLoading &&
          !isMobile &&
          Object.entries(selectedFilters).map(([name, value]) => (
            <Fragment key={name}>
              {Array.isArray(value) &&
                value &&
                value?.map(item => (
                  <Chips
                    key={item}
                    handleRemove={() => handleRemoveFilter(name, item)}
                    className="!text-slate-600 !bg-white md:!bg-slate-100 !text-sm cursor-pointer"
                  >
                    {getFilterTitle(name, item)}
                  </Chips>
                ))}
              {!Array.isArray(value) && name !== 'city' && getFilterTitle(name, value) && (
                <Chips
                  handleRemove={() => handleRemoveFilter(name, value)}
                  className="!text-slate-600 !bg-white md:!bg-slate-100 !text-sm cursor-pointer"
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

