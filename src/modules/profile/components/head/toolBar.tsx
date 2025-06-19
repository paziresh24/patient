import Text from '@/common/components/atom/text/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import EditIcon from '@/common/components/icons/edit';
import InfoIcon from '@/common/components/icons/info';
import ShareIcon from '@/common/components/icons/share';

interface ToolBarProps {
  items: ToolBarItems;
}

export type ToolBarItems = Array<{
  type: 'bookmark' | 'share' | 'edit';
  action: () => void;
  isBookmarked?: boolean;
}>;

export const ToolBar = ({ items = [] }: ToolBarProps) => {
  if (!items.length) return null;

  const typeArray = items.map(item => item.type);

  const reformattedItems = [
    {
      title: 'ذخیره',
      icon: <BookmarkIcon width={21} height={21} fill={items.find(item => item.type == 'bookmark')?.isBookmarked} />,
      shouldShow: typeArray.includes('bookmark'),
      onClick: items.find(item => item.type == 'bookmark')?.action,
    },
    {
      title: 'اشتراک گذاری',
      icon: <ShareIcon width={21} height={21} />,
      shouldShow: typeArray.includes('share'),
      onClick: items.find(item => item.type == 'share')?.action,
    },
    {
      title: 'گزارش',
      icon: <InfoIcon width={21} height={21} />,
      shouldShow: typeArray.includes('edit'),
      onClick: items.find(item => item.type == 'edit')?.action,
    },
  ];

  return (
    <div className="flex items-center space-s-2">
      {reformattedItems
        .filter(item => item.shouldShow)
        .map(item => (
          <div key={item.title} onClick={item.onClick} className="flex items-center cursor-pointer space-s-1">
            {item.icon}
            <Text fontSize="sm">{item.title}</Text>
          </div>
        ))}
    </div>
  );
};

export default ToolBar;
