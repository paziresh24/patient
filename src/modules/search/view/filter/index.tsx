import Skeleton from '@/common/components/atom/skeleton';
import useResponsive from '@/common/hooks/useResponsive';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import { useSearch } from '../../hooks/useSearch';
import { Fragment } from '@/common/fragment';
import { useFilterChange } from '../../hooks/useFilterChange';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useSearchRouting } from '../../hooks/useSearchRouting';
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
  const showDesktopFilters = useFeatureIsOn('search::desktop-filters');
  const showDesktopCategories = useFeatureIsOn('search::desktop-categories');
  const showDesktopSelectedFilters = useFeatureIsOn('search::desktop-selected-filters');

  return (
    <div className="md:w-[23rem] md:min-w-[23rem] flex flex-col space-y-3">
      {(!isEmpty(selectedFilters) || isLoading) && !isMobile && showDesktopSelectedFilters ? (
        <Fragment
          name="FilterSelectedView"
          props={{
            selected: selectedFilters,
            categories,
            filters,
            onRemoveItem: (name: string) => removeFilter(name),
            onDelete: () => changeRoute({ params: { city: searchCity?.en_slug }, overWrite: true }),
          }}
        />
      ) : (
        <SelectedFilters isLoading={isLoading} />
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
                  seleted: selectedFilters,
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
