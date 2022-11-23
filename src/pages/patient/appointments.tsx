import Head from 'next/head';
import { ReactElement, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useGetBooks } from '@/common/apis/services/booking/getBooks';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import Loading from '@/components/atom/loading';
import Skeleton from '@/components/atom/skeleton';
import { Tab, Tabs } from '@/components/atom/tabs';

import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import useWebView from '@/common/hooks/useWebView';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import Turn from '@/modules/myTurn/components/turn';
import { useBookStore } from '@/modules/myTurn/store';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import axios from 'axios';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';

type BookType = 'book' | 'book_request';

export const Appointments: NextPageWithLayout = () => {
  const { query } = useRouter();
  const isWebView = useWebView();
  const [page, setPage] = useState<number>(1);
  const { books, addBooks, setBooks } = useBookStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [type, setType] = useState<BookType>('book');
  const { openLoginModal } = useLoginModalContext();

  const getBooks = useGetBooks({
    page,
    return_type: type,
  });

  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    return () => {
      getBooks.remove();
      handleChangeType('book');
    };
  }, []);

  useEffect(() => {
    if (inView) setPage(prevState => prevState + 1);
  }, [inView]);

  useEffect(() => {
    regetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type]);

  useEffect(() => {
    if (getBooks.isSuccess) {
      setIsLoading(false);
      getBooks.data?.data?.length > 0 && addBooks(getBooks.data.data);
    }
    if (getBooks.isError && axios.isAxiosError(getBooks.error) && getBooks.error?.response?.status === 401)
      openLoginModal({
        state: true,
        postLogin: () => regetchBook(),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getBooks.status]);

  const regetchBook = () => {
    getBooks.remove();
    getBooks.refetch();
  };

  const handleChangeType = (type: BookType) => {
    setPage(1);
    setBooks([]);
    setIsLoading(true);
    setType(type);
  };

  return (
    <>
      <Head>
        <title>نوبت های من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {isWebView && <AppBar title="نوبت های من" className="border-b border-slate-200" backButton={query.referrer === 'profile'} />}

      <div className="sticky top-0 z-10 flex flex-col px-5 pb-0 space-y-5 bg-white">
        {!isWebView && (
          <Text fontWeight="black" fontSize="xl" className="mt-5">
            نوبت های من
          </Text>
        )}

        <div className="sticky top-0 z-10 justify-center w-full bg-white border-b border-solid lg:flex md:shadow-none border-slate-200">
          <Tabs value={type} onChange={value => handleChangeType(value as BookType)} className="container mx-auto">
            <Tab value="book" label="نوبت ها" className="w-full lg:w-auto" />
            <Tab value="book_request" label="درخواست ها" className="w-full lg:w-auto" />
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col self-center w-full p-0 pt-3 space-y-2 md:p-5" data-testid="appointments-container">
        {isLoading && (
          <>
            <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
            <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
            <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
            <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
          </>
        )}
        {books.length > 0 &&
          books.map(turn => (
            <Turn
              key={turn.book_id}
              status={turn.delete === 1 ? BookStatus.deleted : turn.book_status}
              paymentStatus={turn.payment_status}
              id={turn.book_id}
              centerType={
                turn.center?.center_type === 1 ? CenterType.clinic : turn.center?.id === '5532' ? CenterType.consult : CenterType.hospital
              }
              centerInfo={{
                centerId: turn.center?.id,
                centerType: turn.center?.center_type,
                hasPaging: turn.center?.settings?.booking_paging_from_clinic,
                activePaymentStatus: turn.center?.active_online_payment_status === '1',
              }}
              doctorInfo={{
                avatar: turn.doctor_info?.image,
                firstName: turn.doctor_info?.name,
                lastName: turn.doctor_info?.family,
                expertise: getDisplayDoctorExpertise({
                  aliasTitle: turn.doctor_info?.expertises?.[0]?.alias_title,
                  degree: turn.doctor_info?.expertises?.[0]?.degree?.name,
                  expertise: turn.doctor_info?.expertises?.[0]?.expertise?.name,
                }),
                slug: turn.doctor_info?.slug,
                onlineVisitChannels: turn.doctor_info?.online_visit_channels,
              }}
              patientInfo={{
                nationalCode: turn.patient_info?.national_code,
              }}
              turnDetails={{
                bookTime: turn.from,
                waitingTime: turn.doctor_info?.waiting_time_info?.waiting_time_title,
                trackingCode: turn.ref_id,
                centerName: turn.center?.name,
                patientName: `${turn.patient_info?.name ?? ''} ${turn.patient_info?.family ?? ''}`,
              }}
              location={{
                lat: turn.center?.map?.lat,
                lng: turn.center?.map?.lon,
                address: turn.center?.address,
              }}
              feedbackUrl={turn.feed_back_url}
              prescription={{
                ...turn.prescription,
              }}
            />
          ))}
        {!isLoading && getBooks.data?.status !== 204 && (
          <div ref={ref} className="flex justify-center w-full py-8">
            <Loading />
          </div>
        )}
        {!isLoading && books.length === 0 && (
          <Text className="text-slate-400" align="center">
            نوبتی وجود ندارد.
          </Text>
        )}
      </div>
    </>
  );
};

Appointments.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter>
      <PatientProfileLayout>{page}</PatientProfileLayout>
    </LayoutWithHeaderAndFooter>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Appointments;
