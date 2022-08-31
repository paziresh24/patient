import Text from '@/common/components/atom/text';
import { categoryIcons } from '@/modules/search/constants/suggestion/categoryIcons/';

export interface SuggestionCategoryBarProps {
  caption?: string;
  icon: 'hospital-icon' | 'top-icon' | 'list-icon' | 'category-icon' | 'history-icon' | 'search-icon';
  type?: string;
  additional_info?: string;
}

export const SuggestionCategoryBar = (props: SuggestionCategoryBarProps) => {
  const { additional_info, icon, caption, type } = props;
  return (
    <div className="bg-slate-100 p-2 text-sm font-medium flex items-center space-s-2">
      {categoryIcons[icon]()}
      <Text>
        {caption} {additional_info && `(${additional_info})`}
      </Text>
    </div>
  );
};

export default SuggestionCategoryBar;
