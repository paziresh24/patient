import Accordion from '@/common/components/atom/accordion/accordion';
import Text from '@/common/components/atom/text/text';
import RowButton from '@/modules/booking/components/rowButton/rowButton';
import RowText from '@/modules/booking/components/rowText/rowText';
import { ReactNode } from 'react';

export type Data = {
  id?: number;
  name?: string;
  icon?: ReactNode;
  value?: string | { name: string; value?: string; id: number }[] | any;
  type?: string;
  buttonAction?: () => void;
  shouldShow?: boolean;
  isBoldValue?: boolean;
  copyable?: boolean;
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
            title={data.name ?? ''}
            value={data.value}
            titleFontSize="sm"
            titleFontWeight="medium"
            valueFontSize="sm"
            valueFontWeight={data.isBoldValue ? 'bold' : 'medium'}
            copyable={data.copyable}
          />
        )}
        {data.type === 'Button' && (
          <RowButton
            title={data.name ?? ''}
            value={data.value}
            buttonAction={data.buttonAction}
            titleFontSize="sm"
            titleFontWeight="medium"
            variant="secondary"
          />
        )}
        {data.type === 'Label' &&
          (Array.isArray(data.value) ? (
            <div className="flex flex-col space-y-1">
              {data.value.map(item =>
                typeof item === 'string' ? <Text key={item} fontSize="sm" dangerouslySetInnerHTML={{ __html: item }} /> : item,
              )}
            </div>
          ) : (
            <div className="[&>svg]:inline-block space-s-1">
              {data.icon}
              {typeof data.value === 'string' ? <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: data.value }} /> : data.value}
            </div>
          ))}
        {data.type === 'Accordion' && (
          <Accordion className="-mt-1 [&>div]:!p-0 [&>div>h3]:!font-medium !bg-transparent space-y-2" title={data.name ?? ''}>
            {
              <div className="flex flex-col gap-4">
                {data.value?.map((item: Omit<Data, 'shouldShow'>) =>
                  item.value ? (
                    <div key={item.id}>
                      {item.type === 'Text' && (
                        <RowText
                          title={item.name ?? ''}
                          value={item.value}
                          titleFontSize="sm"
                          titleFontWeight="medium"
                          valueFontSize="sm"
                          valueFontWeight="medium"
                        />
                      )}
                      {item.type === 'Button' && (
                        <RowButton
                          title={item.name ?? ''}
                          value={item.value}
                          buttonAction={item.buttonAction}
                          titleFontSize="sm"
                          titleFontWeight="medium"
                          variant="secondary"
                        />
                      )}
                      {item.type === 'Label' && <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: item.value ?? '' }} />}
                    </div>
                  ) : null,
                )}
              </div>
            }
          </Accordion>
        )}
      </div>
    </>
  );
};
export default BaseRow;
