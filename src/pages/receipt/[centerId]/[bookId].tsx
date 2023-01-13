import { useGetReceiptDetails } from '@/common/apis/services/booking/getReceiptDetails';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text';
import ErrorIcon from '@/common/components/icons/error';
import SuccessIcon from '@/common/components/icons/success';
import { LayoutWithOutFooter } from '@/common/components/layouts/layoutWithOutFooter';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { withCSR } from '@/common/hoc/withCsr';
import usePdfGenerator from '@/common/hooks/usePdfGenerator';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { VisitChannels } from '@/modules/receipt/constants/onlineVisitChannels';
import BookInfo from '@/modules/receipt/views/bookInfo/bookInfo';
import clsx from 'clsx';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
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
    requestedTurn: bookDetailsData.book_status === BookStatus.requested,
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
                    <ErrorIcon className="text-red-500" />
                  ) : (
                    <SuccessIcon className="text-green-600" />
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
  return (
    <LayoutWithOutFooter shouldShowPromoteApp={false} {...page.props.config}>
      {page}
    </LayoutWithOutFooter>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Receipt;
