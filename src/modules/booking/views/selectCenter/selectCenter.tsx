import Skeleton from '@/common/components/atom/skeleton/skeleton';
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
      {centers.map((center, index) => (
        <CenterCard key={index} {...center} onClick={handleSelectCenter} />
      ))}
    </div>
  );
};

export default SelectCenter;
