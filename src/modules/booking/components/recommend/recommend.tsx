import { useSearchRecommendByDoctor } from '@/common/apis/services/search/recommend';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { HTMLAttributes } from 'react';
import RecommendCard from './card/card';

interface RecommendProps extends HTMLAttributes<HTMLDivElement> {
  category: string;
  city: string;
  doctorId: string;
}

export const Recommend = ({ className, ...props }: RecommendProps) => {
  const { data, isLoading } = useSearchRecommendByDoctor({
    ...props,
  });

  return (
    <div className={className}>
      {isLoading ? (
        <div className="flex pb-5 pr-5 overflow-auto space-s-3">
          <Skeleton w="22rem" h="18.2rem" rounded="lg" className="min-w-[22rem]" />
          <Skeleton w="22rem" h="18.2rem" rounded="lg" />
        </div>
      ) : (
        <RecommendCard
          listOfDoctors={
            data?.data?.map((doctor: any) => ({
              image: doctor.image,
              displayAddress: doctor.display_address,
              displayExpertise: doctor.display_expertise,
              displayName: doctor.display_name,
              medicalCode: doctor.medical_code,
              experience: doctor.experience,
              freeturn: doctor.freeturn,
              isBulk: doctor.is_bluk,
              ratesCount: doctor.rates_count,
              rate: doctor.star,
              url: doctor.url,
              id: doctor.id,
              action: [
                {
                  title: 'دریافت نوبت',
                  description: `اولین نوبت: ${doctor.freeturn}`,
                },
              ],
            })) ?? []
          }
        />
      )}
    </div>
  );
};

export default Recommend;
