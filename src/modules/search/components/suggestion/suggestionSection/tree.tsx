import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import Link from 'next/link';
import { Item } from '../suggestionCentent';
import style from './section.module.css';

interface TreeSectionProps {
  items: Item[];
}

export const TreeSection = (props: TreeSectionProps) => {
  const { items } = props;
  return (
    <div className="p-2">
      {items?.map((item, index) => (
        <div
          key={index}
          className={clsx(
            'flex bg-white p-2 flex-col tree-section relative pr-9 before:content before:w-[1px] before:h-[calc(100%_-_57px)] before:right-[1.05rem] before:top-9  before:bg-slate-300 before:absolute ',
            style.wrapper,
          )}
        >
          <Link href={item.url ?? '#'}>
            <a>
              {item.formatted_title && (
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  className={clsx(
                    style.title,
                    'before:content before:absolute before:right-3 before:top-3 before:rounded-sm  before:w-3 before:h-3 before:bg-slate-300',
                  )}
                  dangerouslySetInnerHTML={{ __html: item.formatted_title }}
                />
              )}
              {item.sub_title && (
                <div className="mt-2 bg-slate-100 p-2 rounded-md">
                  <Text fontSize="xs" className="line-clamp-2 text-slate-500 leading-5">
                    {item.sub_title}
                  </Text>
                </div>
              )}
            </a>
          </Link>
          <div className="flex flex-col space-y-3 mt-5">
            {item.sub_items?.map((subItem, index) => (
              <Link href={subItem.url ?? '#'} key={index}>
                <a>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    className={clsx(
                      style.title,
                      'relative before:w-3 before:h-[1px] before:bg-slate-300 before:content before:absolute before:top-2 before:-right-[18px]',
                    )}
                    dangerouslySetInnerHTML={{ __html: subItem.formatted_title ?? '' }}
                  />
                </a>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TreeSection;
