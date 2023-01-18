import Divider from '@/common/components/atom/divider';
import { useSearch } from '@/modules/search/hooks/useSearch';
import clsx from 'clsx';
import RadioFilter from './sections/radio';
import SwitchFilter from './sections/switch';

export const AdvancedSearch = ({ className }: { className?: string }) => {
  const { filters } = useSearch();

  if (filters.length === 0) return null;
  return (
    <div className={clsx('flex-col p-5 space-y-3 bg-white rounded-lg shadow-card', className)}>
      {filters
        .filter(item => ['radio', 'switch'].includes(item.type))
        .map((item, index, filtedArray) => (
          <div key={item.title} className="flex flex-col space-y-3">
            {item.type === 'radio' && <RadioFilter title={item.title} items={item.items} name={item.name} />}
            {item.type === 'switch' && <SwitchFilter title={item.title} name={item.name} />}
            {/* {item.type === 'slider_with_count' && (
            <SliderFilter
              title={item.title}
              data={item.items.map((item: any) => ({ lable: item.title, count: item.count, value: item.value }))}
              max={item.items.length - 1}
              min={0}
              name={item.name}
              value={
                selectedFilters?.consult_price
                  ? isArray(selectedFilters?.consult_price)
                    ? [
                        item.items.findIndex(item => item.value === selectedFilters?.consult_price[0]),
                        item.items.findIndex(
                          item => item.value === selectedFilters?.consult_price[selectedFilters?.consult_price.length - 1],
                        ) + 1,
                      ]
                    : [
                        item.items.findIndex(item => item.value === selectedFilters?.consult_price),
                        item.items.findIndex(item => item.value === selectedFilters?.consult_price) + 1,
                      ]
                  : [0, item.items.length]
              }
            />
          )} */}
            {index + 1 !== filtedArray.length && <Divider />}
          </div>
        ))}
    </div>
  );
};

export default AdvancedSearch;
