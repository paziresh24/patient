import Skeleton from '@/common/components/atom/skeleton';
import useResponsive from '@/common/hooks/useResponsive';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import { useSearch } from '../../hooks/useSearch';
const AdvancedSearch = dynamic(() => import('../../components/filters/advancedSearch'));
const Categories = dynamic(() => import('../../components/filters/categories'));
const SelectedFilters = dynamic(() => import('../../components/filters/selectedFilters'));

interface FilterProps {
  isLoading: boolean;
}

export const Filter = (props: FilterProps) => {
  const { isLoading } = props;
  const { isMobile } = useResponsive();
  const { selectedFilters, filters } = useSearch();

  return (
    <div className="md:w-[23rem] md:min-w-[23rem] flex flex-col space-y-3">
      {(!isEmpty(selectedFilters) || isLoading) && <SelectedFilters isLoading={isLoading} />}

      {!isMobile && isEmpty(selectedFilters) && isEmpty(filters) && (
        <Skeleton w="100%" h="42.2rem" rounded="lg" className="hidden md:block" />
      )}

      {!isMobile && (!isEmpty(selectedFilters) || !isEmpty(filters)) && (
        <>
          <Categories className="hidden md:flex" />
          <AdvancedSearch className="hidden md:flex" />
        </>
      )}
    </div>
  );
};

export default Filter;
