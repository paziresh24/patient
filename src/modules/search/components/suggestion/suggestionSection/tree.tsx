import Text from '@/common/components/atom/text';
import { useSuggestionItem } from '@/modules/search/hooks/useSuggestionItemClick';
import { Item } from '@/modules/search/types/suggestion';
import classNames from '@/common/utils/classNames';
import style from './section.module.css';

interface TreeSectionProps {
  items: Item[];
}

export const TreeSection = (props: TreeSectionProps) => {
  const { items } = props;
  const { handleItemClick } = useSuggestionItem();

  return (
    <div className="p-1 bg-white">
      {items?.map((item, index) => (
        <div
          key={index}
          className={classNames(
            'flex bg-white p-2 flex-col tree-section relative pr-8 before:content before:w-[1px] before:h-[calc(100%_-_51px)] before:right-[0.8rem] before:top-[2rem]  before:bg-slate-300 before:absolute ',
            style.wrapper,
          )}
        >
          <div onClick={() => handleItemClick(item, index)} className="cursor-pointer">
            {item.formatted_title && (
              <Text
                fontSize="sm"
                fontWeight="medium"
                className={classNames(
                  style.title,
                  'before:content before:absolute before:right-2 before:top-[.85rem] before:rounded-sm  before:w-3 before:h-3 before:bg-slate-300',
                )}
                dangerouslySetInnerHTML={{ __html: item.formatted_title }}
              />
            )}
            {item.sub_title && (
              <div className="mt-2 bg-slate-100 p-1 px-2 rounded-md">
                <Text fontSize="xs" className="line-clamp-2 text-slate-500 leading-5">
                  {item.sub_title}
                </Text>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3 mt-4">
            {item.sub_items?.map((subItem, index) => (
              <Text
                key={index}
                onClick={() => handleItemClick(subItem, index)}
                fontSize="sm"
                fontWeight="normal"
                className={classNames(
                  style.title,
                  'relative !line-clamp-none !overflow-visible cursor-pointer text-slate-500 before:w-3 before:h-[1px] before:bg-slate-300 before:content before:absolute before:top-2 before:-right-[18px]',
                )}
                dangerouslySetInnerHTML={{ __html: subItem.formatted_title ?? '' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TreeSection;
