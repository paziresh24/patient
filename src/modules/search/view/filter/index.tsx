import Skeleton from '@/common/components/atom/skeleton';
import useResponsive from '@/common/hooks/useResponsive';
import isEmpty from 'lodash/isEmpty';
import AdvancedSearch from '../../components/filters/advancedSearch';
import Categories from '../../components/filters/categories';
import SelectedFilters from '../../components/filters/selectedFilters';
import { useSearch } from '../../hooks/useSearch';

interface FilterProps {
  isLoading: boolean;
}

export const Filter = (props: FilterProps) => {
  const { isLoading } = props;
  const { isMobile } = useResponsive();
  const { categories, selectedFilters } = useSearch();

  return (
    <div className="md:w-[23rem] md:min-w-[23rem] flex flex-col space-y-3">
      {(!isEmpty(selectedFilters) || isLoading) && <SelectedFilters isLoading={isLoading} />}

      {!isMobile &&
        (categories && categories.length === 0 ? (
          <Skeleton w="100%" h="42.2rem" rounded="lg" className="hidden md:block" />
        ) : (
          <>
            <Categories className="hidden md:flex" />
            <AdvancedSearch className="hidden md:flex" />
          </>
        ))}
    </div>
  );
};

export default Filter;
