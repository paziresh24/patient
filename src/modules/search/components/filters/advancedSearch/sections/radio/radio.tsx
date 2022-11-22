import Text from '@/common/components/atom/text';
import { useFilterChange } from '@/modules/search/hooks/useFilterChange';
import { addCommas } from '@persian-tools/persian-tools';

interface RadioFilterProps {
  items: any[];
  name: string;
  title?: string;
  onChange?: (value: any) => void;
}

export const RadioFilter = (props: RadioFilterProps) => {
  const { items, name, title, onChange } = props;
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
          {item.count && (
            <Text fontSize="xs" className="decoration-dotted underline opacity-50">
              {addCommas(item.count ?? 0)}
            </Text>
          )}
        </label>
      ))}
    </div>
  );
};

export default RadioFilter;
