import Skeleton from '@/common/components/atom/skeleton/skeleton';
import orderBy from 'lodash/orderBy';
import CenterCard from '../../components/centerCard/centerCard';
import { Center } from '../../types/selectCenter';

export interface CenterProps {
  centers: Center[];
  onSelect: (center: Center) => void;
  loading?: boolean;
}

export const SelectCenter = (props: CenterProps) => {
  const { centers, onSelect, loading = false } = props;

  const handleSelectCenter = (center: Center) => {
    onSelect(center);
  };

  if (loading)
    return (
      <div className="flex flex-col space-y-2">
        <Skeleton w="100%" h="10rem" rounded="lg" />
        <Skeleton w="100%" h="10rem" rounded="lg" />
        <Skeleton w="100%" h="10rem" rounded="lg" />
      </div>
    );

  return (
    <div className="flex flex-col space-y-2">
      {orderBy(centers, ['isDisable', o => !o.isAvailable]).map(center => (
        <CenterCard key={center.id} {...center} onClick={handleSelectCenter} />
      ))}
    </div>
  );
};

export default SelectCenter;
