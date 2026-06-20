import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import {
  validateDoctorSlug,
  DoctorSlugValidationResponse,
} from '@/common/apis/services/doctor/validateDoctorSlug';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { CENTERS } from '@/common/types/centers';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { picUserImageUrl } from '@/common/utils/picUserImageUrl';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { useQuery } from '@tanstack/react-query';
import moment from 'jalali-moment';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const DoctorInvoiceNotice = ({ slug, serviceId }: { slug: string; serviceId: string }) => {
  const { isLoading, data: profile } = useGetProfileData({ slug: slug as string });
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

  const doctorName = `${profile?.data?.name} ${profile?.data?.family}`;
  const doctorUserId = (doctorSlugData as DoctorSlugValidationResponse | undefined)?.user_id;
  const doctorAvatar = doctorUserId
    ? picUserImageUrl(doctorUserId)
    : publicRuntimeConfig.CDN_BASE_URL + profile?.data?.image;

  const convertTime = (time: number) => {
    return moment(time)?.locale('fa')?.calendar(undefined, {
      nextWeek: 'YYYY/MM/DD(dddd) حدود ساعت HH:mm',
      sameElse: 'YYYY/MM/DD حدود ساعت HH:mm',
      sameDay: 'امروز حدود ساعت HH:mm',
      nextDay: 'فردا حدود ساعت HH:mm',
    });
  };

  const freeturnRaw = profile?.data?.centers
    ?.find((item: any) => item.id == CENTERS.CONSULT)
    ?.freeturns_info?.find((item: any) => item.service_id == serviceId)?.freeturn;

  const freeturn =
    typeof freeturnRaw === 'number' && Number.isFinite(freeturnRaw) ? freeturnRaw * 1000 : null;

  const getFreeturnText = () => {
    if (freeturn === null) return 'در اسرع وقت';
    if (freeturn < Date.now()) return 'در کمتر از ۱۵ دقیقه آینده';
    return convertTime(freeturn);
  };

  return (
    <div className="w-full p-3 mb-2 space-y-3 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
      <DoctorInfo
        className="p-4 rounded-lg bg-slate-100"
        avatar={doctorAvatar}
        fullName={doctorName}
        expertise={getDisplayDoctorExpertise({
          aliasTitle: profile?.data?.expertises?.[0]?.alias_title,
          degree: profile?.data?.expertises?.[0]?.degree?.name,
          expertise: profile?.data?.expertises?.[0]?.expertise?.name,
        })}
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
            <Text className="text-primary" fontWeight="semiBold">
              {getFreeturnText()}
            </Text>{' '}
            شما را آنلاین ویزیت خواهم کرد.
          </Text>
        </div>
      )}
    </div>
  );
};

export default DoctorInvoiceNotice;
