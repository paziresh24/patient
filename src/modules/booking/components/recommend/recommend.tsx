import { useSearchRecommendByDoctor } from '@/common/apis/services/search/recommend';
import { useSearch } from '@/common/apis/services/search/search';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { HTMLAttributes } from 'react';
import { growthbook } from 'src/pages/_app';
import RecommendCard from './card/card';

interface RecommendProps extends HTMLAttributes<HTMLDivElement> {
  category: string;
  city: string;
  doctorId: string;
  centerId?: string;
  limit?: number;
  clickRecommendEvent?: (doctor: any, elementName?: string, elementContent?: string) => void;
}

export const Recommend = ({ className, clickRecommendEvent, limit, ...props }: RecommendProps) => {
  const useVisitOnlineDoctorSubstitute = useFeatureIsOn('profile.use-visit-online-doctor-substitute');

  const recommendDoctor = useSearchRecommendByDoctor(
    {
      ...props,
    },
    { enabled: growthbook.ready && !useVisitOnlineDoctorSubstitute },
  );

  const searchDoctor = useSearch(
    {
      route: decodeURIComponent(props?.city ? props.city : `ir`),
      query: {
        turn_type: 'consult',
        text: props.category,
      },
    },
    { enabled: growthbook.ready && useVisitOnlineDoctorSubstitute },
  );

  const recommendButton = useFeatureValue<any>('profile.recommend_button', {});
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
            (!limit ? doctors : doctors.slice(0, limit))?.map((doctor: any) => ({
              image: doctor.image,
              ...(!useVisitOnlineDoctorSubstitute && { displayAddress: doctor.display_address }),
              displayExpertise: doctor.display_expertise,
              displayName: doctor.title ?? doctor.display_name,
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
          showMore={{
            text: 'نمایش نتایج بیشتر',
            url: `/s/ir/?turn_type=consult&text=${props.category}`,
          }}
        />
      )}
    </div>
  );
};

export default Recommend;
