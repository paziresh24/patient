import { useSearchRecommendByDoctor } from '@/common/apis/services/search/recommend';
import { useSearch } from '@/common/apis/services/search/search';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { useRemovePrefixDoctorName } from '@/common/hooks/useRemovePrefixDoctorName';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { HTMLAttributes } from 'react';
import { growthbook } from 'src/pages/_app';
import RecommendCard from './card/card';

interface RecommendProps extends HTMLAttributes<HTMLDivElement> {
  category: string;
  city: string;
  doctorId: string;
  centerId?: string;
  clickRecommendEvent?: (doctor: any, elementName?: string, elementContent?: string) => void;
}

export const Recommend = ({ className, clickRecommendEvent, ...props }: RecommendProps) => {
  const useVisitOnlineDoctorSubstitute = useFeatureIsOn('profile.use-visit-online-doctor-substitute');

  const recommendDoctor = useSearchRecommendByDoctor(
    {
      ...props,
    },
    { enabled: growthbook.ready && !useVisitOnlineDoctorSubstitute },
  );

  const searchDoctor = useSearch(
    {
      route: decodeURIComponent(`ir/${props.category}`),
      query: {
        turn_type: 'consult',
      },
    },
    { enabled: growthbook.ready && useVisitOnlineDoctorSubstitute },
  );

  const recommendButton = useFeatureValue<any>('profile.recommend_button', {});
  const removePrefixDoctorName = useRemovePrefixDoctorName();
  const doctors = useVisitOnlineDoctorSubstitute ? searchDoctor.data?.search?.result ?? [] : recommendDoctor.data?.data ?? [];

  return (
    <div className={className}>
      {recommendDoctor.isLoading && searchDoctor.isLoading ? (
        <div className="flex pb-5 overflow-auto no-scroll space-s-3">
          <Skeleton w="16rem" h="14rem" rounded="lg" className="min-w-[17rem]" />
          <Skeleton w="16rem" h="14rem" rounded="lg" />
        </div>
      ) : (
        <RecommendCard
          listOfDoctors={
            doctors?.map((doctor: any) => ({
              image: doctor.image,
              ...(!useVisitOnlineDoctorSubstitute && { displayAddress: doctor.display_address }),
              displayExpertise: doctor.display_expertise,
              displayName: removePrefixDoctorName(doctor.title ?? doctor.display_name),
              freeturn: doctor.freeturn,
              isBulk: doctor.is_bluk,
              ratesCount: doctor.rates_count,
              rate: doctor.satisfaction ?? doctor.star * 20,
              url: doctor.url + (useVisitOnlineDoctorSubstitute ? '?from_recommend_section=1&centerTarget=5532' : ''),
              id: doctor.id,
              isOnline: !!useVisitOnlineDoctorSubstitute,
              badges: doctor.badges,
              price: doctor.price,
              ...(recommendButton?.is_show && {
                action: doctor?.actions
                  ? doctor?.actions?.map((action: any) => ({ ...action, description: action.top_title }))
                  : [
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
