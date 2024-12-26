import Skeleton from '@/common/components/atom/skeleton';
import useResponsive from '@/common/hooks/useResponsive';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import { useSearch } from '../../hooks/useSearch';
import { Fragment } from '@/common/fragment';
import { useFilterChange } from '../../hooks/useFilterChange';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useRouter } from 'next/router';
const AdvancedSearch = dynamic(() => import('../../components/filters/advancedSearch'));
const Categories = dynamic(() => import('../../components/filters/categories'));
const SelectedFilters = dynamic(() => import('../../components/filters/selectedFilters'));

interface FilterProps {
  isLoading: boolean;
}

export const Filter = (props: FilterProps) => {
  const { isLoading } = props;
  const { isMobile } = useResponsive();
  const { filters, categories, selectedCategory, selectedSubCategory, searchCity } = useSearch();
  const { handleChange, removeFilter, filters: selectedFilters } = useFilterChange();
  const { changeRoute } = useSearchRouting();
  const {
    query: { params },
  } = useRouter();
  const showDesktopFilters = useFeatureIsOn('search::desktop-filters');
  const showDesktopCategories = useFeatureIsOn('search::desktop-categories');
  const showDesktopSelectedFilters = useFeatureIsOn('search::desktop-selected-filters');

  const handleRemoveFilter = (name: string, value: string) => {
    console.log('filter removing', name, value);
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
    <div className="md:w-[23rem] md:min-w-[23rem] flex flex-col space-y-3">
      {(!isEmpty(selectedFilters) || isLoading) && !isMobile && showDesktopSelectedFilters ? (
        <Fragment
          name="FilterSelectedView"
          props={{
            selected: selectedFilters,
            categories,
            filters,
            onRemoveItem: (name: string, value: any) => handleRemoveFilter(name, value),
            onDelete: handleRemoveAllFilters,
          }}
        />
      ) : (
        (!isEmpty(selectedFilters) || isLoading) && !isMobile && !showDesktopSelectedFilters && <SelectedFilters isLoading={isLoading} />
      )}

      {!isMobile && isEmpty(selectedFilters) && isEmpty(filters) && (
        <Skeleton w="100%" h="42.2rem" rounded="lg" className="hidden md:block" />
      )}

      {!isMobile && (!isEmpty(selectedFilters) || !isEmpty(filters)) && (
        <>
          {showDesktopCategories ? (
            <div className="hidden md:flex">
              <Fragment
                name="FilterExpertiseView"
                props={{
                  items: categories,
                  selectedCategory: selectedCategory?.value,
                  selectedSubCategory: selectedSubCategory?.value,
                }}
              />
            </div>
          ) : (
            <Categories className="hidden md:flex" />
          )}
          {showDesktopFilters ? (
            <div className="hidden md:flex">
              <Fragment
                name="FilterListView"
                props={{
                  items: filters,
                  onClick: (name: string, value: string) => handleChange(name, value),
                  selected: selectedFilters,
                }}
              />
            </div>
          ) : (
            <AdvancedSearch className="hidden md:flex" />
          )}
        </>
      )}
    </div>
  );
};

export default Filter;

