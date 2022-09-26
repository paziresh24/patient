import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { LayoutWithOutFooter } from '@/common/components/layouts/layoutWithOutFooter';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import BookingSteps from '@/modules/booking/views';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '../_app';
const { publicRuntimeConfig } = getConfig();

const Booking: NextPageWithLayout = () => {
  const router = useRouter();
  const { data, isSuccess, isLoading, isIdle } = useGetProfileData(
    {
      slug: router.query?.slug?.toString() ?? '/',
    },
    {
      enabled: !!router.query?.slug,
    },
  );

  useEffect(() => {}, [isSuccess]);

  const userCenterId: string = useMemo(
    () => data?.data?.data?.centers?.find((center: any) => center.id === router?.query?.center_id)?.user_center_id,
    [isSuccess],
  );

  return (
    <div className="flex flex-col-reverse  md:flex-row items-start space-s-0 md:space-s-5 max-w-screen-xl mx-auto md:py-10">
      <div className="w-full bg-white md:rounded-lg shadow-card p-5 md:p-8">
        <BookingSteps
          center={{
            centerId: router?.query?.center_id?.toString() ?? '',
            serviceId: router?.query?.service_id?.toString() ?? '',
            userCenterId: userCenterId,
            serverId: data?.data?.data?.server_id ?? '',
          }}
        />
      </div>
      <div className="w-full md:w-[35rem] bg-white p-5 shadow-card md:rounded-lg mb-2 md:mb-0">
        <DoctorInfo
          isLoading={isLoading || isIdle}
          avatar={publicRuntimeConfig.CLINIC_BASE_URL + data?.data?.data?.image}
          firstName={data?.data?.data?.name}
          lastName={data?.data?.data?.family}
          expertise={getDisplayDoctorExpertise({
            aliasTitle: data?.data?.data?.expertises?.[0]?.alias_title,
            degree: data?.data?.data?.expertises?.[0]?.degree?.name,
            expertise: data?.data?.data?.expertises?.[0]?.expertise?.name,
          })}
        />
      </div>
    </div>
  );
};

Booking.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithOutFooter>{page}</LayoutWithOutFooter>;
};

export default Booking;
