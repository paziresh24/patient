import Text from '@/common/components/atom/text';
import { categoryIcons } from '@/modules/search/constants/suggestion/categoryIcons';
import clsx from 'clsx';
import Link from 'next/link';
import style from './section.module.css';

interface SearchSectionProps {
  formatted_title: string;
  icon: 'hospital-icon' | 'top-icon' | 'list-icon' | 'category-icon' | 'history-icon' | 'search-icon';
  url?: string;
}

export const SearchSection = (props: SearchSectionProps) => {
  const { formatted_title, icon, url } = props;
  return (
    <Link href={url ?? '#'}>
      <a>
        <div className={clsx('bg-slate-100 p-2 py-5 text-sm font-medium flex items-center space-s-2 pr-5', style.wrapper)}>
          {categoryIcons[icon]()}
          <Text dangerouslySetInnerHTML={{ __html: formatted_title }} />
        </div>
      </a>
    </Link>
  );
};

export default SearchSection;
