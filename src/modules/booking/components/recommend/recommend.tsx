import { useSearchRecommendByDoctor } from '@/common/apis/services/search/recommend';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { HTMLAttributes } from 'react';
import RecommendCard from './card/card';

interface RecommendProps extends HTMLAttributes<HTMLDivElement> {
  category: string;
  city: string;
  doctorId: string;
  centerId?: string;
  clickRecommendEvent?: (doctor: any, elementName?: string, elementContent?: string) => void;
}

export const Recommend = ({ className, clickRecommendEvent, ...props }: RecommendProps) => {
  const { data, isLoading } = useSearchRecommendByDoctor({
    ...props,
  });
  const recommendButton = useFeatureValue<any>('profile.recommend_button', {});
  const router = useRouter();
  const doctors = data?.data ?? [];

  return (
    <div className={className}>
      {isLoading ? (
        <div className="flex pb-5 overflow-auto no-scroll space-s-3">
          <Skeleton w="22rem" h="16rem" rounded="lg" className="min-w-[22rem]" />
          <Skeleton w="22rem" h="16rem" rounded="lg" />
        </div>
      ) : (
        <RecommendCard
          listOfDoctors={
            doctors?.map((doctor: any) => ({
              image: doctor.image,
              displayAddress: doctor.display_address,
              displayExpertise: doctor.display_expertise,
              displayName: doctor.display_name,
              freeturn: doctor.freeturn,
              isBulk: doctor.is_bluk,
              ratesCount: doctor.rates_count,
              rate: doctor.star * 20,
              url: doctor.url,
              id: doctor.id,
              ...(recommendButton?.is_show && {
                action: [
                  {
                    title: recommendButton?.title,
                    description: `اولین نوبت: ${doctor.freeturn}`,
                    outline: recommendButton?.is_outline,
                  },
                ],
              }),
            })) ?? []
          }
          clickRecommendEvent={(id: string, elementName?: string, elementContent?: string) =>
            clickRecommendEvent?.(
              doctors?.find((doctor: any) => doctor.id === id),
              elementName,
              elementContent,
            )
          }
        />
      )}
    </div>
  );
};

export default Recommend;
