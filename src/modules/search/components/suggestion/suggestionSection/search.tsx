import Text from '@/common/components/atom/text';
import { categoryIcons } from '@/modules/search/constants/suggestion/categoryIcons';
import { useSuggestionItem } from '@/modules/search/hooks/useSuggestionItemClick';
import { Item } from '@/modules/search/types/suggestion';
import clsx from 'clsx';
import style from './section.module.css';

interface SearchSectionProps {
  items: Item[];
}

export const SearchSection = (props: SearchSectionProps) => {
  const { items } = props;
  const { handleItemClick } = useSuggestionItem();

  return (
    <>
      {items?.map((item, index) => (
        <div
          key={index}
          className={clsx('bg-slate-100 cursor-pointer p-2 py-4 text-sm font-medium flex items-center space-s-2 pr-4', style.wrapper)}
          onClick={() => handleItemClick(item, index)}
        >
          {categoryIcons['search-icon']()}
          <Text className="line-clamp-1" dangerouslySetInnerHTML={{ __html: item.formatted_title ?? '' }} />
        </div>
      ))}
    </>
  );
};

export default SearchSection;
