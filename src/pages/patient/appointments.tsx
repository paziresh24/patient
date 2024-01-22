import { ReactElement, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useGetBooks } from '@/common/apis/services/booking/getBooks';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import Loading from '@/components/atom/loading';
import Skeleton from '@/components/atom/skeleton';
import { Tab, Tabs } from '@/components/atom/tabs';

import { useGetServerTime } from '@/common/apis/services/general/getServerTime';
import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize from '@/common/hooks/useCustomize';
import { splunkInstance } from '@/common/services/splunk';
import isAfterPastDaysFromTimestamp from '@/common/utils/isAfterPastDaysFromTimestamp ';
import { useEasyAppointmentsList } from '@/modules/bookingV3/apis/easyapp-appointments-list';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Turn from '@/modules/myTurn/components/turn';
import { useBookStore } from '@/modules/myTurn/store';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { useFeatureValue } from '@growthbook/growthbook-react';
import axios from 'axios';
import moment from 'jalali-moment';
import { GetServerSidePropsContext } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

type BookType = 'book' | 'book_request' | 'online_visit';

export const Appointments = () => {
  const { query, ...router } = useRouter();
  const { t } = useTranslation('patient/appointments');
  const [page, setPage] = useState<number>(1);
  const { books, addBooks, setBooks } = useBookStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [type, setType] = useState<BookType>('book');
  const { handleOpenLoginModal } = useLoginModalContext();
  const serverTime = useGetServerTime();
  const university = useCustomize(state => state.customize?.partnerKey);
  const currentTime = serverTime?.data?.data?.data.timestamp ?? Date.now();
  const user = useUserInfoStore(state => state.info);
  const sendEventForLocalTypeBookCenterList = useFeatureValue('appointments.remove-sync|center-list', { centers: [''] });

  const getBooks = useGetBooks(
    {
      page,
      return_type: type,
      university: university,
    },
    { enabled: false },
  );

  const getEasyBookVisitOnline = useEasyAppointmentsList({ user_phone: user.cell! });

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
    // Prefetch the receipt page
    router.prefetch('/receipt/[centerId]/[bookId]');

    return () =>
      handleOpenLoginModal({
        state: false,
      });
  }, []);

  useEffect(() => {
    if (inView) setPage(prevState => prevState + 1);
  }, [inView]);

  useEffect(() => {
    if (type !== 'online_visit') refetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type, university]);

  useEffect(() => {
    if (getEasyBookVisitOnline.isSuccess && type === 'online_visit') {
      setIsLoading(false);
      if (getEasyBookVisitOnline.data?.data?.appointments?.length > 0) {
        addBooks(
          getEasyBookVisitOnline.data?.data?.appointments.map((item: any) => ({
            book_id: item.book_id,
            doctor_info: {
              name: item.provider_name,
              family: item.provider_family,
              display_expertise: item.provider_specialty,
              book_id: item.id,
              slug: item.provider_slug,
            },
            center: {
              id: 'easybook',
            },
            patient_info: {
              name: user.name,
              family: user.family,
            },
            book_time_string: moment(item.session_time).locale('fa').format('YYYY/MM/DD HH:mm'),
            from: moment(item.session_time).unix(),
            ref_id: item.refid,
            book_status: BookStatus.notVisited,
            payment_status: PaymentStatus.paid,
            selected_online_visit_channel: {
              type: item.contactpoint_name,
              channel: item.contactpoint_name,
              channel_link: item.contactpoint_link,
            },
          })),
        );
      }
    }
  }, [getEasyBookVisitOnline.status, type]);

  useEffect(() => {
    if (getBooks.isSuccess) {
      setIsLoading(false);
      if (getBooks.data?.data?.length > 0) {
        addBooks(getBooks.data.data);
        getBooks.data?.data.forEach((item: any) => {
          if (
            item?.book_type_id !== 7 &&
            item?.book_type_id !== 8 &&
            sendEventForLocalTypeBookCenterList?.centers?.includes?.(item?.center_id)
          ) {
            splunkInstance('doctor-profile').sendEvent({
              group: 'appointments',
              type: 'see-local-book',
              event: {
                data: {
                  patient_fullname: `${user.name} ${user.family}`,
                  patient_cell: user.cell,
                  book_type_id: item.book_type_id,
                  book_center_id: item.center_id,
                  book_center_name: item.center.name,
                  book_time_string: item.book_time_string,
                  book_from: item.from,
                  book_status: item.book_status,
                },
              },
            });
          }
        });
      }
    }
    if (getBooks.isError && axios.isAxiosError(getBooks.error) && getBooks.error?.response?.status === 401)
      handleOpenLoginModal({
        state: true,
        description: 'لطفا برای مشاهده نوبت ها، وارد شوید.',
        postLogin: () => refetchBook(),
        closable: false,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getBooks.status]);

  const refetchBook = () => {
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
      <Seo title={t('title')} description={t('description')} />

      <AppBar title={t('title')} className="hidden pwa:!flex" backButton={query.referrer === 'profile'} />

      <div className="sticky top-0 z-10 flex flex-col px-5 pb-0 bg-white rounded-md">
        <Text fontWeight="black" fontSize="xl" className="mt-5 mb-5 pwa:hidden">
          {t('title')}
        </Text>

        <div className="sticky top-0 z-10 justify-center w-full bg-white border-b border-solid lg:flex md:shadow-none border-slate-200">
          <Tabs value={type} onChange={value => handleChangeType(value as BookType)} className="container mx-auto">
            <Tab value="book" label={t('tunrsTabName')} className="w-full lg:w-auto" />
            {getEasyBookVisitOnline.data?.data?.appointments?.length > 0 ? (
              <Tab value="online_visit" label={t('visitOnlineTabName')} className="w-full lg:w-auto" />
            ) : (
              <></>
            )}
            <Tab value="book_request" label={t('requestsTabName')} className="w-full lg:w-auto" />
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
                turn.center?.center_type === 1
                  ? CenterType.clinic
                  : turn.center?.id === '5532' || turn.center?.id === 'easybook'
                  ? CenterType.consult
                  : CenterType.hospital
              }
              centerInfo={{
                centerId: turn.center?.id,
                centerType: turn.center?.center_type,
                hasPaging: turn.center?.settings?.booking_paging_from_clinic,
                activePaymentStatus: turn.center?.active_online_payment_status === '1',
                userCenterId: turn.center?.user_center_id,
                serviceId: turn.service_id,
              }}
              doctorInfo={{
                avatar: turn.doctor_info?.image,
                firstName: turn.doctor_info?.name,
                lastName: turn.doctor_info?.family,
                expertise:
                  turn.doctor_info?.display_expertise ??
                  getDisplayDoctorExpertise({
                    aliasTitle: turn.doctor_info?.expertises?.[0]?.alias_title,
                    degree: turn.doctor_info?.expertises?.[0]?.degree?.name,
                    expertise: turn.doctor_info?.expertises?.[0]?.expertise?.name,
                  }),
                slug: turn.doctor_info?.slug,
                onlineVisitChannels: turn.doctor_info?.online_visit_channels,
                selectedOnlineVisitChannel: turn?.selected_online_visit_channel?.type ? turn?.selected_online_visit_channel : undefined,
              }}
              patientInfo={{
                nationalCode: turn.patient_info?.national_code,
                cell: turn.patient_info?.cell,
              }}
              turnDetails={{
                bookTime: turn.book_time_string,
                bookTimestamp: turn.from,
                waitingTime: turn.doctor_info?.waiting_time_info?.waiting_time_title,
                trackingCode: turn.ref_id,
                centerName: turn.center?.name,
                patientName: `${turn.patient_info?.name ?? ''} ${turn.patient_info?.family ?? ''}`,
                description: turn.comment ?? '',
                respiteDeleteTurn: turn.respite_to_refund_after_delete ?? '',
                notRefundable: turn.payment_status === 'paid' && turn.refundable === 0,
                possibilityBeingVisited: !isAfterPastDaysFromTimestamp({ numberDay: 3, currentTime, timestamp: turn.from }),
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
        {!isLoading && type !== 'online_visit' && getBooks.data?.status !== 204 && (
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
    <LayoutWithHeaderAndFooter {...page.props.config}>
      <PatientProfileLayout>{page}</PatientProfileLayout>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Appointments;
