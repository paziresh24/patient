/* eslint-disable @next/next/no-img-element */
import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
import { useSuggestionItem } from '@/modules/search/hooks/useSuggestionItemClick';
import { Item } from '@/modules/search/types/suggestion';
import getConfig from 'next/config';
import LikeIcon from '@/common/components/icons/like';
import { useSatisfactionPercent } from '@/common/apis/services/rate/satisfactionPercent';
import { useCountOfFeedbacks } from '@/common/apis/services/rate/countOfFeedbacks';
import Skeleton from '@/common/components/atom/skeleton';
import { useRate } from '@/common/apis/services/reviews/rate';
import { StarIcon } from '@/modules/search/constants/suggestion/categoryIcons/icons/star';
const { publicRuntimeConfig } = getConfig();

interface SliderSectionProps {
  items: Item[];
}

interface SliderCardProps {
  item: Item;
  index: number;
}

export const SliderCard = (props: SliderCardProps) => {
  const { index, item } = props;
  const { handleItemClick } = useSuggestionItem();
  const slug = item.url?.split('/')?.[2];

  const { data: rateData, isLoading: rateLoading, isError: isRateError } = useRate({ slug: slug as string });

  return (
    <div>
      <div
        className="relative flex items-center p-2 transition-shadow bg-white border border-solid rounded-lg shadow-md cursor-pointer hover:shadow-lg border-slate-200 w-72 space-s-3"
        onClick={() => handleItemClick(item, index)}
      >
        <div
          className={classNames({
            'before:content before:bg-green-500 before:w-3 before:rounded-full before:border-2 before:bottom-3 before:right-2 before:border-white before:h-3 before:absolute before:z-30':
              item.is_online,
          })}
        >
          <img
            src={`${publicRuntimeConfig.CDN_BASE_URL}${item.image}`}
            alt=""
            className="relative rounded-full w-14 h-14 min-w-[3.5rem]"
            width={56}
            height={56}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Text fontWeight="medium" fontSize="sm">
            {item.name}
          </Text>
          <Text fontSize="xs" className="line-clamp-1">
            {item.sub_title}
          </Text>
          {rateLoading ? (
            <Skeleton w="7rem" h="1.25rem" rounded="md" />
          ) : isRateError ? null : (
            <div className="flex items-center space-s-1">
              <StarIcon className="text-primary mb-1" width={20} height={20} />
              <Text fontWeight="medium" fontSize="sm" className="text-primary">
                {(
                  ((+rateData?.list?.[0]?.quality_of_treatment ?? 0) +
                    (+rateData?.list?.[0]?.doctor_encounter ?? 0) +
                    (+rateData?.list?.[0]?.explanation_of_issue ?? 0)) /
                  3
                ).toFixed(1)}
              </Text>
              <Text fontSize="sm">({rateData?.list?.[0]?.count_rates} نظر)</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SliderSection = (props: SliderSectionProps) => {
  const { items } = props;

  return (
    <div className="flex p-3 overflow-auto bg-white space-s-3 no-scroll">
      {items?.map((item, index) => (
        <SliderCard key={index} index={index} item={item} />
      ))}
    </div>
  );
};

export default SliderSection;
