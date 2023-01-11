import { useGetReceiptDetails } from '@/common/apis/services/booking/getReceiptDetails';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text';
import { LayoutWithOutFooter } from '@/common/components/layouts/layoutWithOutFooter';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { withCSR } from '@/common/hoc/withCsr';
import usePdfGenerator from '@/common/hooks/usePdfGenerator';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { VisitChannels } from '@/modules/receipt/constants/onlineVisitChannels';
import BookInfo from '@/modules/receipt/views/bookInfo/bookInfo';
import clsx from 'clsx';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { NextPageWithLayout } from '../../_app';
const { publicRuntimeConfig } = getConfig();

const Receipt: NextPageWithLayout = () => {
  const {
    query: { bookId, centerId },
    ...router
  } = useRouter();
  const [removeModal, setRemoveModal] = useState(false);
  const getReceiptDetails = useGetReceiptDetails();
  const pdfGenerator = usePdfGenerator({
    ref: 'receipt',
    fileName: 'Paziresh24-Receipt',
    orientation: 'portrait',
    pageSize: 'a4',
    scale: 2,
  });
  const { shareTurn, removeBookApi, centerMap } = useBookAction();
  const centerType = centerId === '5532' ? CenterType.consult : CenterType.clinic;

  useEffect(() => {
    if (bookId && centerId) {
      getReceiptDetails.mutate({
        book_id: bookId.toString(),
        center_id: centerId.toString(),
      });
    }
  }, [bookId]);

  const bookDetailsData = useMemo(() => getReceiptDetails.isSuccess && getReceiptDetails.data?.data?.data, [getReceiptDetails.status]);

  const turnStatus = {
    deletedTurn: bookDetailsData.book_delete === '1',
    expiredTurn: bookDetailsData.book_status === 'expired' || bookDetailsData.record_status === 'expired',
    requestedTurn: bookDetailsData.book_status === 'requested',
  };

  const showOptionalButton = centerType === 'clinic' && !turnStatus.deletedTurn && !turnStatus.expiredTurn && !turnStatus.requestedTurn;

  const handleRemoveBookTurn = () => {
    removeBookApi.mutate(
      {
        center_id: bookDetailsData.center_id,
        national_code: bookDetailsData.patient_temp_national_code,
        reference_code: bookDetailsData.book_ref_id,
      },
      {
        onSuccess: data => {
          if (data.data.status === ClinicStatus.SUCCESS) {
            setRemoveModal(false);
            toast.success('نوبت شما با موفقیت لغو شد!');
            router.push('/patient/appointments');
            return;
          }
          toast.error(data.data.message);
        },
      },
    );
  };

  const handleShareAction = () => {
    shareTurn({
      bookId: bookDetailsData.book_id,
      text: `رسید نوبت ${bookDetailsData?.doctor_display_name} برای ${bookDetailsData?.patient_temp_name} ${bookDetailsData?.patient_temp_family}`,
      title: 'رسیدنوبت',
      centerId: bookDetailsData.center_id,
    });
  };
  const handleMyTrunButtonAction = () => {
    router.push({
      pathname: '/patient/appointments',
    });
  };

  return (
    <div className="flex flex-col-reverse items-start max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
      <div className="w-full p-5 space-y-6 bg-white md:basis-4/6 md:rounded-lg shadow-card">
        <div id="receipt">
          {!turnStatus.requestedTurn && (
            <>
              {getReceiptDetails.isSuccess ? (
                <div className="flex flex-col items-center justify-center mt-4 space-y-3">
                  {turnStatus.deletedTurn || turnStatus.expiredTurn ? (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14 2.5C7.64873 2.5 2.5 7.64873 2.5 14C2.5 20.3513 7.64873 25.5 14 25.5C20.3513 25.5 25.5 20.3513 25.5 14C25.5 7.64873 20.3513 2.5 14 2.5ZM0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14ZM14 7.08333C14.6904 7.08333 15.25 7.64298 15.25 8.33333V15.4167C15.25 16.107 14.6904 16.6667 14 16.6667C13.3096 16.6667 12.75 16.107 12.75 15.4167V8.33333C12.75 7.64298 13.3096 7.08333 14 7.08333ZM14 21.0833C14.7824 21.0833 15.4167 20.4491 15.4167 19.6667C15.4167 18.8843 14.7824 18.25 14 18.25C13.2176 18.25 12.5833 18.8843 12.5833 19.6667C12.5833 20.4491 13.2176 21.0833 14 21.0833Z"
                        fill="#FF0000"
                        data-v-6f651adc=""
                      ></path>
                    </svg>
                  ) : (
                    <svg width="43" height="43" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.875 18.5C5.875 11.5274 11.5274 5.875 18.5 5.875C25.4726 5.875 31.125 11.5274 31.125 18.5C31.125 25.4726 25.4726 31.125 18.5 31.125C11.5274 31.125 5.875 25.4726 5.875 18.5ZM18.5 3.375C10.1467 3.375 3.375 10.1467 3.375 18.5C3.375 26.8533 10.1467 33.625 18.5 33.625C26.8533 33.625 33.625 26.8533 33.625 18.5C33.625 10.1467 26.8533 3.375 18.5 3.375ZM25.5506 14.7589C26.0387 14.2707 26.0387 13.4793 25.5506 12.9911C25.0624 12.503 24.2709 12.503 23.7828 12.9911L16.9583 19.8156L14.7589 17.6161C14.2707 17.128 13.4793 17.128 12.9911 17.6161C12.503 18.1043 12.503 18.8957 12.9911 19.3839L16.0745 22.4672C16.5626 22.9554 17.3541 22.9554 17.8422 22.4672L25.5506 14.7589Z"
                        fill="#28A745"
                      ></path>
                    </svg>
                  )}
                  <Text
                    fontWeight="bold"
                    className={clsx('text-green-600', {
                      'text-red-500': turnStatus.deletedTurn || turnStatus.expiredTurn,
                    })}
                  >
                    {turnStatus.deletedTurn
                      ? 'نوبت شما حذف شده است'
                      : turnStatus.expiredTurn
                      ? 'زمان نوبت شما به پایان رسیده است'
                      : ' نوبت شما با موفقیت ثبت شد'}
                  </Text>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center w-full">
                    <Skeleton w="2.9rem" h="2.9rem" rounded="full" className="mb-4" />
                    <Skeleton w="10rem" h="1.1rem" rounded="md" />
                  </div>
                </>
              )}
            </>
          )}
          <BookInfo
            turnData={bookDetailsData}
            loading={getReceiptDetails.isLoading || getReceiptDetails.isIdle}
            centerId={centerId?.toString()!}
          />
        </div>
        {showOptionalButton && (
          <>
            {getReceiptDetails.isSuccess ? (
              <div className="flex flex-col space-y-3">
                <div className="flex space-s-3">
                  <Button block variant="secondary" onClick={pdfGenerator}>
                    دانلود رسید نوبت
                  </Button>
                  <Button block variant="secondary" onClick={handleShareAction}>
                    اشتراک گذاری
                  </Button>
                </div>
                <div className="flex space-s-3">
                  <Button block variant="secondary" onClick={handleMyTrunButtonAction}>
                    نوبت های من
                  </Button>
                  <Button block variant="secondary" onClick={() => setRemoveModal(true)}>
                    لغو نوبت
                  </Button>
                </div>
                <Button
                  block
                  variant="secondary"
                  onClick={() => centerMap({ lat: bookDetailsData.center_lat, lon: bookDetailsData.center_lon })}
                >
                  مشاهده در نقشه و مسیریابی
                </Button>
              </div>
            ) : (
              <ReceiptButtonLoading />
            )}
          </>
        )}
        {turnStatus.requestedTurn && (
          <Button block variant="secondary" onClick={handleMyTrunButtonAction}>
            نوبت های من
          </Button>
        )}
        {centerType === 'consult' && bookDetailsData.online_visit_channels?.[0].type === VisitChannels.igap && !turnStatus.expiredTurn && (
          <div className="flex flex-col space-y-3">
            <Button block variant="secondary" onClick={() => (window.location = bookDetailsData.online_visit_channels[0].channel_link)}>
              شروع گفتگو با پزشک در آی گپ
            </Button>
          </div>
        )}
      </div>
      <div className="w-full p-3 mb-2 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
        <DoctorInfo
          className="p-4 rounded-lg bg-slate-50"
          avatar={publicRuntimeConfig.CLINIC_BASE_URL + bookDetailsData?.doctor_image}
          firstName={
            centerType === 'consult'
              ? bookDetailsData.doctor_display_name
              : `دکتر ${bookDetailsData?.doctor_name ?? bookDetailsData?.doctor_display_name}`
          }
          lastName={bookDetailsData?.doctor_family}
          expertise={getDisplayDoctorExpertise({
            aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
            degree: bookDetailsData?.expertises?.[0]?.degree?.name,
            expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
          })}
          isLoading={getReceiptDetails.isLoading || getReceiptDetails.isIdle}
        />
      </div>
      <Modal title="آیا از لغو نوبت مطمئن هستید؟" onClose={setRemoveModal} isOpen={removeModal}>
        <div className="flex space-s-2">
          <Button theme="error" block onClick={handleRemoveBookTurn} loading={removeBookApi.isLoading}>
            لغو نوبت
          </Button>
          <Button theme="error" variant="secondary" block onClick={() => setRemoveModal(false)}>
            انصراف
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const ReceiptButtonLoading = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
      </div>
      <div className="flex justify-between items-center !mt-3">
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
      </div>
      <div className="!mt-3">
        <Skeleton w="100%" h="2.8rem" rounded="lg" />
      </div>
    </>
  );
};

Receipt.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithOutFooter shouldShowPromoteApp={false}>{page}</LayoutWithOutFooter>;
};

export const getServerSideProps = withCSR(async () => {
  return {
    props: {},
  };
});

export default Receipt;
