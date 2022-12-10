import Select from '../../select';

interface FreeTurnProps {
  timeText?: string;
  loading?: boolean;
  selected: boolean;
  onSelect: () => void;
}

export const FreeTurn = (props: FreeTurnProps) => {
  const { timeText, loading, onSelect, selected } = props;
  return (
    <Select
      title="زودترین زمان نوبت خالی:"
      subTitle={timeText ?? 'زمان نوبت خالی وجود ندارد'}
      isLoading={loading}
      selected={selected}
      onSelect={onSelect}
    />
  );
};

export default FreeTurn;
