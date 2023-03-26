import Chips from '@/common/components/atom/chips/chips';
import Text from '@/common/components/atom/text/text';
import EyeIcon from '@/common/components/icons/eye';
import classNames from '@/common/utils/classNames';
import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import RateBadge from '@/components/atom/badge/badge';
import LikeIcon from '@/components/icons/like';
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
  satisfaction?: string;
  rateCount?: string;
  editable?: boolean;
  infoEditAction?: () => void;
}

export const Head = (props: HeadProps) => {
  const {
    displayName,
    image,
    title,
    subTitle,
    serviceList,
    pageViewCount,
    toolBarItems,
    className,
    satisfaction,
    rateCount,
    editable,
    infoEditAction,
  } = props;
  return (
    <div className={classNames('py-4 flex flex-col space-y-3 bg-white', className)}>
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
        <Info image={image} displayName={displayName} title={title} subTitle={subTitle} editable={editable} editAction={infoEditAction} />
      </div>
      {serviceList && (
        <ScrollContainer
          className={classNames('flex space-s-1 px-4 items-center', {
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
      {!!satisfaction && (
        <div className="self-center cursor-pointer" onClick={() => scrollIntoViewWithOffset('#reviews_section', 90)}>
          <RateBadge
            text={`${satisfaction}%`}
            icon={<LikeIcon className="w-5 text-white" />}
            parentClassName="!bg-green-600"
            className="mt-1"
            fontSize="sm"
            caption={`رضایت (${rateCount} نظر)`}
          />
        </div>
      )}
    </div>
  );
};

export default Head;
