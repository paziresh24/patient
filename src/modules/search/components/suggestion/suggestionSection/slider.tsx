import Text from '@/common/components/atom/text';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';
import { Item } from '../suggestionCentent';
const { publicRuntimeConfig } = getConfig();

interface SliderSectionProps {
  items: Item[];
}

export const SliderSection = (props: SliderSectionProps) => {
  const { items } = props;
  return (
    <div className="flex p-3 pb-0 space-s-3 overflow-auto">
      {items.map(item => (
        <Link href={item.url ?? '#'} key={item.position}>
          <a>
            <div className="flex items-center shadow-md cursor-pointer  bg-white border border-solid border-slate-300 p-2 rounded-lg w-80 space-s-3">
              <div>
                <Image
                  src={`${publicRuntimeConfig.CLINIC_BASE_URL}${item.image}`}
                  alt=""
                  className="rounded-full min-w-[4rem]"
                  width={65}
                  height={65}
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
