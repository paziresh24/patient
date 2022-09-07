/* eslint-disable @next/next/no-img-element */
import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import getConfig from 'next/config';
import Link from 'next/link';
import { Item } from '../suggestionCentent';
const { publicRuntimeConfig } = getConfig();

interface SliderSectionProps {
  items: Item[];
}

export const SliderSection = (props: SliderSectionProps) => {
  const { items } = props;
  return (
    <div className="flex p-4 space-s-3 overflow-auto">
      {items?.map(item => (
        <Link href={item.url ?? '#'} key={item.position}>
          <a>
            <div className="relative flex items-center shadow-md cursor-pointer  bg-white border border-solid border-slate-300 p-2 rounded-lg w-80 space-s-3">
              <div
                className={clsx({
                  'before:content before:bg-green-500 before:w-3 before:rounded-full before:border-2 before:right-3 before:border-white before:h-3 before:absolute before:z-30':
                    item.is_online,
                })}
              >
                <img
                  src={`${publicRuntimeConfig.CLINIC_BASE_URL}${item.image}`}
                  alt=""
                  width={65}
                  height={65}
                  className="relative rounded-full min-w-[4rem]"
                />
              </div>
              <div className="flex flex-col">
                <Text fontWeight="medium">{item.name}</Text>
                <Text fontSize="sm" className="line-clamp-1">
                  {item.sub_title}
                </Text>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default SliderSection;
