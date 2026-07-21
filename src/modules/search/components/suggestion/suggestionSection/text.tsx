import Text from '@/common/components/atom/text';
import { categoryIcons } from '@/modules/search/constants/suggestion/categoryIcons';
import { useSuggestionItem } from '@/modules/search/hooks/useSuggestionItemClick';
import { Item } from '@/modules/search/types/suggestion';
import classNames from '@/common/utils/classNames';
import { safeHighlight } from '@/modules/search/functions/safeHighlight';
import style from './section.module.css';

interface TextSectionProps {
  items: Item[];
}

export const TextSection = (props: TextSectionProps) => {
  const { items } = props;
  const { handleItemClick } = useSuggestionItem();

  return (
    <div className="p-3 py-2 space-y-2 bg-white">
      {items?.map((item, index) => (
        <div
          key={item.position}
          className={classNames('flex p-1 cursor-pointer space-s-2 items-center', style.wrapper)}
          onClick={() => handleItemClick(item, index)}
        >
          <>
            {item.type && categoryIcons[item.type]?.()}
            <Text fontSize="sm" className={style.title}>
              {safeHighlight(item.formatted_title)}
            </Text>
          </>
        </div>
      ))}
    </div>
  );
};

export default TextSection;
