/* eslint-disable @next/next/no-img-element */
import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
import { useSuggestionItem } from '@/modules/search/hooks/useSuggestionItemClick';
import { Item } from '@/modules/search/types/suggestion';
import getConfig from 'next/config';
import style from './section.module.css';
const { publicRuntimeConfig } = getConfig();

interface CardSectionProps {
  items: Item[];
}

export const CardSection = (props: CardSectionProps) => {
  const { items } = props;
  const { handleItemClick } = useSuggestionItem();

  return (
    <div className="py-2 space-y-1 bg-white">
      {items?.map((item, index) => (
        <div
          key={index}
          className={classNames('flex items-center cursor-pointer py-1 px-3 rounded-lg space-s-3', style.wrapper)}
          onClick={() => handleItemClick(item, index)}
        >
          <div>
            <img
              src={`${publicRuntimeConfig.CDN_BASE_URL}${item.image}`}
              alt=""
              className="rounded-full w-11 min-w-[2.75rem]"
              width={44}
              height={44}
            />
          </div>
          <div className="flex flex-col">
            <Text
              className={style.title}
              fontWeight="medium"
              fontSize="sm"
              dangerouslySetInnerHTML={{ __html: item.formatted_title ?? '' ?? '' }}
            />
            <Text fontSize="xs" className="line-clamp-1">
              {item.sub_title}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
