/* eslint-disable @next/next/no-img-element */
import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import getConfig from 'next/config';
import Link from 'next/link';
import { Item } from '../suggestionCentent';
import style from './section.module.css';
const { publicRuntimeConfig } = getConfig();

interface CardSectionProps {
  items: Item[];
}

export const CardSection = (props: CardSectionProps) => {
  const { items } = props;
  return (
    <div>
      {items.map(item => (
        <Link href={item.url ?? '#'} key={item.position}>
          <a>
            <div className={clsx('flex items-center cursor-pointer p-3 rounded-lg space-s-3', style.wrapper)}>
              <div>
                <img src={`${publicRuntimeConfig.CLINIC_BASE_URL}${item.image}`} alt="" className="rounded-full" width={50} height={50} />
              </div>
              <div className="flex flex-col">
                <Text className={style.title} fontWeight="medium" dangerouslySetInnerHTML={{ __html: item.formatted_title ?? '' }} />
                <Text fontSize="sm">{item.sub_title}</Text>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default CardSection;
