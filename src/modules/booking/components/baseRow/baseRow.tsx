import Accordion from '@/common/components/atom/accordion/accordion';
import RowButton from '@/common/components/atom/rowButton/rowButton';
import RowText from '@/common/components/atom/rowText/rowText';
import Text from '@/common/components/atom/text/text';

type Data = {
  id: number;
  name: string;
  value?: string | { name: string; value?: string; id: number }[] | any;
  type: string;
  buttonAction?: () => void;
  shouldShow: boolean;
  isBoldValue?: boolean;
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
            valueFontWeight={data.isBoldValue ? 'bold' : 'medium'}
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
        {data.type === 'Label' && (
          <Text fontSize="sm" fontWeight={data.isBoldValue ? 'bold' : 'medium'} dangerouslySetInnerHTML={{ __html: data.value }} />
        )}
        {data.type === 'Accordion' && (
          <Accordion className="-mt-1" title={data.name}>
            {
              <div className="flex flex-col gap-4">
                {data.value?.map((item: Omit<Data, 'shouldShow'>) => (
                  <div key={item.id}>
                    {item.type === 'Text' && (
                      <RowText
                        title={item.name}
                        value={item.value}
                        titleFontSize="sm"
                        titleFontWeight="medium"
                        valueFontSize="sm"
                        valueFontWeight="medium"
                      />
                    )}
                    {item.type === 'Button' && (
                      <RowButton
                        title={item.name}
                        value={item.value}
                        buttonAction={item.buttonAction}
                        titleFontSize="sm"
                        titleFontWeight="medium"
                        variant="secondary"
                      />
                    )}
                    {item.type === 'Label' && (
                      <Text fontSize="sm" fontWeight="medium">
                        {item.name}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            }
          </Accordion>
        )}
      </div>
    </>
  );
};
export default BaseRow;
