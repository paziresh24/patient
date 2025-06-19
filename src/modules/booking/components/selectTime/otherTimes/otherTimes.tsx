import Select from '../../select';
import SelectOtherTurnTime, { SelectOtherTurnTimeProps } from './otherTimesContent';

interface OtherTimesProps extends SelectOtherTurnTimeProps {
  onSelect: () => void;
  selected: boolean;
}

export const OtherTimes = (props: OtherTimesProps) => {
  const { days, onSelectDay, onSelectTime, onSelect, selected } = props;
  return (
    <div className="flex flex-col space-y-3">
      <Select title="انتخاب زمان دیگر" selected={selected} onSelect={onSelect} />
      {selected && <SelectOtherTurnTime days={days} onSelectDay={onSelectDay} onSelectTime={onSelectTime} />}
    </div>
  );
};

export default OtherTimes;
