import {
  validateDoctorSlug,
  DoctorSlugValidationResponse,
} from '@/common/apis/services/doctor/validateDoctorSlug';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { useDoctorExpertise } from '@/common/hooks/useDoctorExpertise';
import { useDoctorFullName } from '@/common/hooks/useDoctorFullName';
import { useDoctorImage } from '@/common/hooks/useDoctorImage';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { getImageUrl } from '@/common/utils/getImageUrl';
import { picUserImageUrl } from '@/common/utils/picUserImageUrl';
import { useInvoiceNoticeFreeturn } from '@/modules/booking/hooks/factor/useInvoiceNoticeFreeturn';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { useQuery } from '@tanstack/react-query';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const DoctorInvoiceNotice = ({ slug, serviceId: _serviceId }: { slug: string; serviceId: string }) => {
  const { data: fullName, isLoading: isFullNameLoading } = useDoctorFullName(slug);
  const { data: expertises, isLoading: isExpertiseLoading } = useDoctorExpertise(slug);
  const { data: doctorImage } = useDoctorImage(slug);
  const { data: doctorSlugData } = useQuery(
    ['doctorSlugForFactorImage', slug],
    () => validateDoctorSlug(slug),
    {
      enabled: !!slug,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  );

  const isLoading = isFullNameLoading || isExpertiseLoading;
  const { freeturnText, isFreeturnLoading } = useInvoiceNoticeFreeturn({ slug });

  const doctorName = [fullName?.name, fullName?.family].filter(Boolean).join(' ');
  const doctorUserId = (doctorSlugData as DoctorSlugValidationResponse | undefined)?.user_id;
  const doctorAvatar = doctorUserId
    ? picUserImageUrl(doctorUserId)
    : getImageUrl(doctorImage?.image, publicRuntimeConfig.CDN_BASE_URL) || undefined;

  const primaryExpertise = expertises?.[0];
  const expertiseLabel = primaryExpertise
    ? getDisplayDoctorExpertise({
        aliasTitle: primaryExpertise.alias_title ?? '',
        degree: primaryExpertise.degree?.name ?? '',
        expertise: primaryExpertise.expertise?.name ?? '',
      })
    : '';

  return (
    <div className="w-full p-3 mb-2 space-y-3 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
      <DoctorInfo
        className="p-4 rounded-lg bg-slate-100"
        avatar={doctorAvatar}
        fullName={doctorName}
        expertise={expertiseLabel}
        isLoading={isLoading}
      />
      {isLoading && <Skeleton w="100%" h="5em" className="!mt-2" rounded="md" />}
      {!isLoading && (
        <div className="flex flex-col p-2 space-y-1  border-r-2 border-slate-200">
          <Text fontSize="sm" as="p">
            سلام. من {doctorName} هستم.
          </Text>
          <Text as="p" fontSize="sm" align="justify" className="leading-6">
            پس از نهایی شدن نوبت،{' '}
            {isFreeturnLoading ? (
              <Skeleton w="8rem" h="1rem" className="inline-block align-middle" rounded="sm" />
            ) : (
              <Text className="text-primary" fontWeight="semiBold">
                {freeturnText}
              </Text>
            )}{' '}
            شما را آنلاین ویزیت خواهم کرد.
          </Text>
        </div>
      )}
    </div>
  );
};

export default DoctorInvoiceNotice;
