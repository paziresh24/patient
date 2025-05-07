import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { CENTERS } from '@/common/types/centers';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import moment from 'jalali-moment';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const DoctorInvoiceNotice = ({ slug, serviceId }: { slug: string; serviceId: string }) => {
  const { isLoading, data: profile } = useGetProfileData({ slug: slug as string });

  const doctorName = `${profile?.data?.name} ${profile?.data?.family}`;

  const convertTime = (time: number) => {
    return moment(time)?.locale('fa')?.calendar(undefined, {
      nextWeek: 'YYYY/MM/DD(dddd) حدود ساعت HH:mm',
      sameElse: 'YYYY/MM/DD حدود ساعت HH:mm',
      sameDay: 'امروز حدود ساعت HH:mm',
      nextDay: 'فردا حدود ساعت HH:mm',
    });
  };

  const freeturn =
    profile?.data?.centers
      ?.find((item: any) => item.id == CENTERS.CONSULT)
      ?.freeturns_info?.find((item: any) => item.service_id == serviceId)?.freeturn * 1000;

  return (
    <div className="w-full p-3 mb-2 space-y-3 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
      <DoctorInfo
        className="p-4 rounded-lg bg-slate-100"
        avatar={publicRuntimeConfig.CDN_BASE_URL + profile?.data?.image}
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
              {freeturn < new Date().getTime() ? 'در کمتر از ۱۵ دقیقه آینده' : convertTime(freeturn)}
            </Text>{' '}
            شما را آنلاین ویزیت خواهم کرد.
          </Text>
        </div>
      )}
    </div>
  );
};

export default DoctorInvoiceNotice;
