import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import Link from 'next/link';
import { Item } from '../suggestionCentent';
import style from './section.module.css';

interface TextSectionProps {
  items: Item[];
}

export const TextSection = (props: TextSectionProps) => {
  const { items } = props;
  return (
    <div className="p-3">
      {items?.map(item => (
        <Link href={item.url ?? '#'} key={item.position}>
          <a>
            <div className={clsx('flex bg-white p-2', style.wrapper)}>
              <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: item.formatted_title ?? '' }} />
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default TextSection;
