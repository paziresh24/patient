import { useFilterChange } from '@/modules/search/hooks/useFilterChange';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { Fragment } from '@/common/fragment';
import { addCommas } from '@persian-tools/persian-tools';

export const MobileToolbar = () => {
  const { orderItems, categories, filters, total } = useSearch();
  const { handleChange, removeFilter, filters: selectedFilters } = useFilterChange();

  return (
    <div className="md:hidden w-full">
      <Fragment
        name="FilterRow"
        props={{
          items: {
            categories: categories,
            filters,
            order_items: orderItems,
            selected_filters: selectedFilters,
          },
          onClick: (name: string, value: string) => handleChange(name, value),
          onDelete: (name: string) => removeFilter(name),
          selectedSort: selectedFilters?.['sortBy'],
          countOfFilters: addCommas(total),
        }}
      />
    </div>
  );
};

export default MobileToolbar;

