import Text from '@/common/components/atom/text';
import { useFilterChange } from '@/modules/search/hooks/useFilterChange';

export const RadioFilter = ({
  items,
  name,
  title,
  onChange,
}: {
  items: any[];
  name: string;
  title?: string;
  onChange?: (value: any) => void;
}) => {
  const { handleChange, filters } = useFilterChange();
  return (
    <div className="flex flex-col space-y-2">
      {title && (
        <Text fontWeight="bold" className="mb-1">
          {title}
        </Text>
      )}
      {items?.map(item => (
        <label key={item.title} className="flex items-center cursor-pointer space-s-2">
          <input
            checked={filters[name] === item.value}
            type="radio"
            name={name}
            onChange={e => {
              e.target.checked && handleChange(name, item.value);
              onChange && onChange({ name, value: item.value });
            }}
          />
          <Text>{item.title}</Text>
        </label>
      ))}
    </div>
  );
};

export default RadioFilter;
