import Select from '../../select';

interface FreeTurnProps {
  title: string;
  timeText?: string;
  loading?: boolean;
  selected: boolean;
  onSelect: () => void;
}

export const FreeTurn = (props: FreeTurnProps) => {
  const { title, timeText, loading, onSelect, selected } = props;
  return (
    <Select
      title={`${title}:`}
      subTitle={timeText ?? 'زمان نوبت خالی وجود ندارد'}
      isLoading={loading}
      selected={selected}
      onSelect={onSelect}
    />
  );
};

export default FreeTurn;
