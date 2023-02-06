import Chips from '@/common/components/atom/chips/chips';
import Text from '@/common/components/atom/text/text';
import EyeIcon from '@/common/components/icons/eye';
import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import clsx from 'clsx';
import ScrollContainer from 'react-indiana-drag-scroll';
import Info from '../../components/head/info';
import ToolBar, { ToolBarItems } from '../../components/head/toolBar';

interface HeadProps {
  image: string;
  displayName: string;
  title?: string;
  subTitle: string;
  serviceList?: string[];
  pageViewCount?: number;
  toolBarItems?: ToolBarItems;
  className?: string;
}

export const Head = (props: HeadProps) => {
  const { displayName, image, title, subTitle, serviceList, pageViewCount, toolBarItems, className } = props;
  return (
    <div className={clsx('py-4 space-y-3 bg-white', className)}>
      <div className="px-4 space-y-3">
        <div className="flex justify-between">
          {toolBarItems && <ToolBar items={toolBarItems} />}
          {pageViewCount && (
            <div className="flex space-s-1">
              <Text fontSize="sm">{convertLongToCompactNumber(pageViewCount)}</Text>
              <EyeIcon width={20} height={20} />
            </div>
          )}
        </div>
        <Info image={image} displayName={displayName} title={title} subTitle={subTitle} />
      </div>
      {serviceList && (
        <ScrollContainer
          className={clsx('flex space-s-1 px-4 items-center', {
            'justify-center': serviceList.length === 1,
          })}
        >
          {serviceList.map(service => (
            <Chips
              className="!bg-transparent border text-center min-w-fit !rounded-xl border-slate-200 !text-slate-600 !whitespace-normal"
              key={service}
            >
              {service}
            </Chips>
          ))}
        </ScrollContainer>
      )}
    </div>
  );
};

export default Head;
