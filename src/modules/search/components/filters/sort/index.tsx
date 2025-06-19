import Autocomplete from '@/common/components/atom/autocomplete';
import Text from '@/common/components/atom/text';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { useMemo } from 'react';
import { useFilterChange } from '../../../hooks/useFilterChange';

export const freeturnItems = {
  all: 'هر زمان',
  today: 'امروز',
  tomorrow: 'تا فردا',
  nextThreeDays: 'تا سه روز آینده',
  nextFiveDays: 'تا پنج روز آینده',
  nextSevenDays: 'تا هفت روز آینده',
};

export const Sort = () => {
  const { handleChange, filters } = useFilterChange();
  const { orderItems } = useSearch();

  const orderItemsFormatted = useMemo(() => {
    return Object.entries(orderItems).map(([value, label]: any) => ({ label, value }));
  }, [orderItems]);

  const freeturnItemsFormatted = useMemo(() => {
    return Object.entries(freeturnItems).map(([value, label]: any) => ({ label, value }));
  }, [orderItems]);

  return (
    <div className="flex space-s-3">
      <div className="flex items-center bg-white rounded-lg space-s-1 shadow-card">
        <Text className="mr-2" fontSize="sm" fontWeight="semiBold">
          مرتب سازی:
        </Text>
        <Autocomplete
          size="small"
          className="font-medium border-0 rounded-tr-none rounded-br-none"
          classNameWrapper="lg:w-64"
          options={orderItemsFormatted}
          onChange={e => handleChange('sortBy', e.target.value.value)}
          value={
            orderItemsFormatted.find(item => item.value === filters['sortBy']) ?? orderItemsFormatted.find(item => item.value === 'clinic')
          }
        />
      </div>
      <div className="flex items-center bg-white rounded-lg space-s-1 shadow-card">
        <Text className="mr-2" fontSize="sm" fontWeight="semiBold">
          نزدیکترین نوبت:
        </Text>
        <Autocomplete
          size="small"
          className="font-medium border-0 rounded-tr-none rounded-br-none"
          classNameWrapper="lg:w-36"
          options={freeturnItemsFormatted}
          onChange={e => handleChange('freeturn', e.target.value.value)}
          value={
            freeturnItemsFormatted.find(item => item.value === filters['freeturn']) ??
            freeturnItemsFormatted.find(item => item.value === 'all')
          }
        />
      </div>
    </div>
  );
};

export default Sort;
