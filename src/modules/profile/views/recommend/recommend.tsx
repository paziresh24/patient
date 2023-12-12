import Text from '@/common/components/atom/text';
import Recommend from '@/modules/booking/components/recommend';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

interface RecommendWrapperProps {
  city: any;
  doctorId: string;
  groupExpertise: any;
  clickRecommendEvent: any;
}

export const RecommendWrapper = ({ city, groupExpertise, doctorId, clickRecommendEvent }: RecommendWrapperProps) => {
  const useVisitOnlineDoctorSubstitute = useFeatureIsOn('profile.use-visit-online-doctor-substitute');

  return (
    <div className="flex flex-col space-y-3 md:hidden">
      {useVisitOnlineDoctorSubstitute ? (
        <Text fontWeight="bold" className="px-4 leading-6 md:px-0 line-clamp-1">
          پزشکان آنلاین {groupExpertise.name}{' '}
          <Text fontWeight="medium" fontSize="sm">
            منتخب بیماران
          </Text>
        </Text>
      ) : (
        <Text fontWeight="bold" className="px-4 leading-6 md:px-0 line-clamp-1">
          برترین پزشکان {groupExpertise.name} {city.name ? `در ${city.name}` : null}{' '}
          <Text fontWeight="medium" fontSize="sm">
            از دیدگاه بیماران
          </Text>
        </Text>
      )}
      <Recommend
        className="pr-4 md:pr-0"
        doctorId={doctorId}
        category={groupExpertise.en_slug}
        city={city.en_slug}
        clickRecommendEvent={clickRecommendEvent}
        limit={3}
      />
    </div>
  );
};

export default RecommendWrapper;
