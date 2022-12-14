import RowButton from '@/common/components/atom/rowButton/rowButton';
import RowText from '@/common/components/atom/rowText/rowText';

type Data = {
  id: number;
  name: string;
  value?: string | { name: string; value?: string; id: number }[];
  type: string;
  buttonAction?: () => void;
  shouldShow: boolean;
};

interface BaseRowProps {
  data: Data;
}

export const BaseRow = (props: BaseRowProps) => {
  const { data } = props;
  return (
    <>
      <div>
        {data.type === 'Text' && (
          <RowText
            title={data.name}
            value={data.value}
            titleFontSize="sm"
            titleFontWeight="medium"
            valueFontSize="sm"
            valueFontWeight="medium"
          />
        )}
        {data.type === 'Button' && (
          <RowButton
            title={data.name}
            value={data.value}
            buttonAction={data.buttonAction}
            titleFontSize="sm"
            titleFontWeight="medium"
            variant="secondary"
          />
        )}
      </div>
    </>
  );
};
export default BaseRow;
