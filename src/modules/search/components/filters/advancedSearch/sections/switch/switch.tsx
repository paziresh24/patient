import Switch from '@/common/components/atom/switch';
import Text from '@/common/components/atom/text';
import { useFilterChange } from '@/modules/search/hooks/useFilterChange';

export const SwitchFilter = ({ title, name }: { title: string; name: string }) => {
  const { handleChange, filters } = useFilterChange();

  return (
    <div>
      <label className="flex items-center justify-between cursor-pointer">
        <Text fontWeight="bold">{title}</Text>
        <Switch checked={!!filters[name]} onChange={e => handleChange(name, e.target.checked)} />
      </label>
    </div>
  );
};

export default SwitchFilter;
