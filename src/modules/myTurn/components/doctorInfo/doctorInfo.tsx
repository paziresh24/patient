import React from 'react';
import Skeleton from '@/common/components/atom/skeleton';
import Aavatar from '@/components/atom/avatar';
import Text from '@/components/atom/text';
import { useDoctorFullName } from '@/common/hooks/useDoctorFullName';
import { useDoctorImage } from '@/common/hooks/useDoctorImage';
import { useDoctorExpertise } from '@/common/hooks/useDoctorExpertise';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

interface DoctorInfoProps {
  /**
   * Avatar src (url)
   */
  avatar?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  expertise?: string;
  className?: string;
  isLoading?: boolean;
  /**
   * Doctor slug for fetching doctor info via API
   */
  slug?: string;
}

export const DoctorInfo: React.FC<DoctorInfoProps> = props => {
  const { avatar, firstName, lastName, fullName, expertise, className, isLoading = false, slug } = props;

  // Fetch doctor data in parallel - name, image, and expertise
  const shouldFetchDoctorData = !!slug && (!fullName || !avatar || !expertise);

  const {
    data: doctorFullNameData,
    isLoading: isDoctorNameLoading,
    isError: isDoctorNameError,
  } = useDoctorFullName(slug, shouldFetchDoctorData && !fullName);

  const {
    data: doctorImageData,
    isLoading: isDoctorImageLoading,
    isError: isDoctorImageError,
  } = useDoctorImage(slug, shouldFetchDoctorData && !avatar);

  const {
    data: doctorExpertiseData,
    isLoading: isDoctorExpertiseLoading,
    isError: isDoctorExpertiseError,
  } = useDoctorExpertise(slug, shouldFetchDoctorData && !expertise);

  // Determine the final doctor name
  const finalDoctorName = React.useMemo(() => {
    if (fullName) return fullName;
    if (doctorFullNameData?.name && doctorFullNameData?.family) {
      return `${doctorFullNameData.name} ${doctorFullNameData.family}`;
    }
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return '';
  }, [fullName, doctorFullNameData, firstName, lastName]);

  // Determine the final doctor image
  const finalDoctorImage =
    publicRuntimeConfig.CDN_BASE_URL +
    React.useMemo(() => {
      if (avatar) return avatar;
      if (doctorImageData?.image) return doctorImageData.image;
      return '';
    }, [avatar, doctorImageData]);

  // Determine the final doctor expertise
  const finalDoctorExpertise = React.useMemo(() => {
    if (expertise) return expertise;
    if (doctorExpertiseData && doctorExpertiseData.length > 0) {
      const firstExpertise = doctorExpertiseData[0];
      return getDisplayDoctorExpertise({
        aliasTitle: firstExpertise.alias_title,
        degree: firstExpertise.degree?.name || '',
        expertise: firstExpertise.expertise?.name || '',
      });
    }
    return '';
  }, [expertise, doctorExpertiseData]);

  // Show loading if either the main loading state is true or we're fetching doctor data
  const showLoading = isLoading || (shouldFetchDoctorData && (isDoctorNameLoading || isDoctorImageLoading || isDoctorExpertiseLoading));

  return (
    <div className={`flex items-center space-s-3 ${className ?? ''}`}>
      {showLoading && <Loading />}
      {!showLoading && (
        <>
          <Aavatar src={finalDoctorImage} name={finalDoctorName} />
          <div className="flex flex-col">
            <Text fontSize="sm" fontWeight="bold" className="line-clamp-1" data-testid="doctor-info__full-name">
              {finalDoctorName}
            </Text>
            {finalDoctorExpertise && (
              <Text fontSize="xs" className="mt-2 line-clamp-2" data-testid="doctor-info__expertise">
                {finalDoctorExpertise}
              </Text>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Loading = () => {
  return (
    <>
      <Skeleton w="4.4rem" h="4.4rem" rounded="full" />
      <div className="flex flex-col mr-4 space-y-3">
        <Skeleton w="7rem" h="1rem" rounded="full" />
        <Skeleton w="4rem" h="1rem" rounded="full" />
      </div>
    </>
  );
};

export default DoctorInfo;
