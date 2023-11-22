import { useSearch } from '@/common/apis/services/search/search';
import Loading from '@/common/components/atom/loading';
import { splunkSearchInstance } from '@/common/services/splunk';
import { BadgeProps } from '@/modules/search/components/badge';
import SearchCard from '@/modules/search/components/card/card';
import random from 'lodash/random';
import { useMemo } from 'react';

interface OnlineVisitRecommendProps {
  route: string;
  turn_type: string;
  classnames?: string;
  avatarSize?: 'lg' | 'md';
  type: 'center' | 'doctor';
  details?: {
    address?: {
      text: string;
    };
    price?: string;
    badges?: BadgeProps[];
  };
  actions?: {
    text: string;
    description: string;
    action?: () => void;
    outline: boolean;
  }[];
  event?: {
    group: string;
    type: string;
    data?: any;
  };
}

export const OnlineVisitRecommend = ({
  route,
  turn_type,
  classnames,
  avatarSize = 'md',
  type,
  details,
  event,
}: OnlineVisitRecommendProps) => {
  const searchData = useSearch({
    route: decodeURIComponent(`${route}`),
    query: {
      turn_type,
    },
  });

  const substituteDoctor = useMemo(() => searchData.data?.search?.result?.[random(0, 2)] ?? {}, [searchData.data]);

  const handleClickDcotorCardDoctor = ({ url }: { url: string }) => {
    splunkSearchInstance().sendEvent({
      group: event?.group,
      type: event?.type,
      event: {
        slug: url.replace('/dr/', ''),
        ...event?.data,
      },
    });
    location.assign(url.replace('/dr/', '/booking/') + '?centerId=5532&skipTimeSelectStep=true');
  };

  return (
    <div onClick={() => handleClickDcotorCardDoctor({ url: substituteDoctor.url })}>
      {(searchData.isLoading || !substituteDoctor?.url) && (
        <div className="flex justify-center w-full">
          <Loading className="w-8 h-8 my-8 " />
        </div>
      )}
      {searchData.isSuccess && substituteDoctor?.url && (
        <SearchCard
          avatarSize={avatarSize}
          baseInfo={{
            displayName: substituteDoctor.title,
            expertise: substituteDoctor.display_expertise,
            experience: substituteDoctor.experience,
            isVerify: true,
            avatar: substituteDoctor.image,
            rate: {
              count: substituteDoctor.rates_count,
              satisfaction: substituteDoctor.satisfaction,
            },
            isOnline: true,
          }}
          type={type}
          details={details}
          className={classnames}
          actions={[
            {
              text: `گفتگو با ${substituteDoctor.title}`,
              outline: false,
              description: '',
            },
          ]}
        />
      )}
    </div>
  );
};

export default OnlineVisitRecommend;
