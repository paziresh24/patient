import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
import { LayoutWithOutFooter } from '@/common/components/layouts/layoutWithOutFooter';
import { withCSR } from '@/common/hoc/withCsr';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import FactorWrapper from '@/modules/booking/views/factor/wrapper';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '../../_app';
const { publicRuntimeConfig } = getConfig();

const Factor: NextPageWithLayout = () => {
  const {
    query: { bookId, centerId },
  } = useRouter();

  const getBookDetails = useGetBookDetails();
  const centerPayment = useCenterPayment();

  useEffect(() => {
    if (bookId)
      getBookDetails.mutate({
        book_id: bookId.toString(),
        type: 'factor',
      });
  }, [bookId]);

  const bookDetailsData = useMemo(() => getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0], [getBookDetails.status]);

  return (
    <div className="flex flex-col-reverse items-start max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
      <div className="w-full md:basis-4/6">
        <FactorWrapper bookId={bookId as string} centerId={centerId as string} />
      </div>
      <div className="w-full p-3 mb-2 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
        <DoctorInfo
          className="p-4 rounded-lg bg-slate-50"
          avatar={publicRuntimeConfig.CLINIC_BASE_URL + bookDetailsData?.doctor_image}
          firstName={bookDetailsData?.doctor_name}
          lastName={bookDetailsData?.doctor_family}
          expertise={getDisplayDoctorExpertise({
            aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
            degree: bookDetailsData?.expertises?.[0]?.degree?.name,
            expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
          })}
          isLoading={getBookDetails.isLoading || getBookDetails.isIdle}
        />
      </div>
    </div>
  );
};

Factor.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithOutFooter shouldShowPromoteApp={false} showBottomNavigation={false}>
      {page}
    </LayoutWithOutFooter>
  );
};

export const getServerSideProps = withCSR(async () => {
  return {
    props: {},
  };
});

export default Factor;
