import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import { Fragment2 } from '@/common/fragment/fragment2';
import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { enrichProfileCentersWithSamanAvailability } from '@/modules/booking/functions/mapSamanAvailabilityToCenters';
import { getProfileSeoSectionData } from '@/modules/profile/functions/buildProfileSeoAboutHtml';
import { useMemo } from 'react';
import ProfileSeo from '.plasmic/ProfileSeo';

export type ProfileSeoSectionProps = {
  slug: string;
  information: any;
  centers: any[];
  expertises: any;
  feedbacks: any;
  history: any;
  similarLinks: any[];
  seo: any;
};

export const ProfileSeoSection = (props: ProfileSeoSectionProps) => {
  const { slug, information, centers, expertises, feedbacks, history, similarLinks, seo } = props;
  const samanAvailability = useSamanDoctorAvailabilityStatus(slug, { enabled: !!slug });

  const centersForSeo = useMemo(
    () => enrichProfileCentersWithSamanAvailability(centers, samanAvailability.data),
    [centers, samanAvailability.data],
  );

  const countOfPageView = convertLongToCompactNumber(history?.count_of_page_view);
  const seoSectionData = getProfileSeoSectionData({
    information,
    centers: centersForSeo,
    expertises,
    feedbacks,
    history,
    similarLinks,
    seo,
    countOfPageView,
  });

  return (
    <Fragment2
      name="ProfileSeo"
      Component={ProfileSeo}
      args={{
        information,
        feedbacks,
        center: seoSectionData.center,
        isOnlineVisitCenter: seoSectionData.isOnlineVisitCenter,
        doctorExpertise: seoSectionData.doctorExpertise,
        countOfPageView,
        breadcrumbs: seoSectionData.breadcrumbs,
        similarLinks,
        expertises,
        about: seoSectionData.about,
      }}
    />
  );
};

export default ProfileSeoSection;
