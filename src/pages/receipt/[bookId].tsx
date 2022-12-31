import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text';
import { LayoutWithOutFooter } from '@/common/components/layouts/layoutWithOutFooter';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import usePdfGenerator from '@/common/hooks/usePdfGenerator';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import BookInfo from '@/modules/receipt/views/bookInfo/bookInfo';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { NextPageWithLayout } from '../_app';
const { publicRuntimeConfig } = getConfig();

const Receipt: NextPageWithLayout = () => {
  const {
    query: { bookId },
  } = useRouter();
  const [removeModal, setRemoveModal] = useState(false);
  const getBookDetails = useGetBookDetails();
  const centerPayment = useCenterPayment();
  const router = useRouter();
  const pdfGenerator = usePdfGenerator({
    ref: 'receipt',
    fileName: 'Paziresh24-Receipt',
    orientation: 'portrait',
    pageSize: 'a4',
    scale: 2,
  });
  const { shareTurn, removeBookApi, centerMap } = useBookAction();

  useEffect(() => {
    if (bookId)
      getBookDetails.mutate({
        book_id: bookId.toString(),
      });
  }, [bookId]);

  const bookDetailsData = useMemo(() => getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0], [getBookDetails.status]);

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
            window.location.href = `/dr/${bookDetailsData.doctor_slug}`;
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
    });
  };
  const handleMyTrunButtonAction = () => {
    router.push({
      pathname: '/patient/appointments',
    });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row items-start space-s-0 md:space-s-5 max-w-screen-xl mx-auto md:py-10 p-2 overflow-hidden">
      <div className="w-full flex flex-col space-y-6 bg-white rounded-lg shadow-card p-3 md:p-8">
        <div id="receipt">
          <div className="flex flex-col justify-center items-center space-y-3 mt-4">
            <svg width="43" height="43" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.875 18.5C5.875 11.5274 11.5274 5.875 18.5 5.875C25.4726 5.875 31.125 11.5274 31.125 18.5C31.125 25.4726 25.4726 31.125 18.5 31.125C11.5274 31.125 5.875 25.4726 5.875 18.5ZM18.5 3.375C10.1467 3.375 3.375 10.1467 3.375 18.5C3.375 26.8533 10.1467 33.625 18.5 33.625C26.8533 33.625 33.625 26.8533 33.625 18.5C33.625 10.1467 26.8533 3.375 18.5 3.375ZM25.5506 14.7589C26.0387 14.2707 26.0387 13.4793 25.5506 12.9911C25.0624 12.503 24.2709 12.503 23.7828 12.9911L16.9583 19.8156L14.7589 17.6161C14.2707 17.128 13.4793 17.128 12.9911 17.6161C12.503 18.1043 12.503 18.8957 12.9911 19.3839L16.0745 22.4672C16.5626 22.9554 17.3541 22.9554 17.8422 22.4672L25.5506 14.7589Z"
                fill="#28A745"
              ></path>
            </svg>
            <Text fontWeight="bold" className="text-green-600">
              نوبت شما با موفقیت ثبت شد
            </Text>
          </div>
          <BookInfo turnData={bookDetailsData} loading={getBookDetails.isLoading || getBookDetails.isIdle} />
        </div>
        <div className="flex flex-col space-y-3">
          <div className="flex space-s-3">
            <Button block variant="secondary" onClick={pdfGenerator} loading={centerPayment.isLoading}>
              دانلود رسید نوبت
            </Button>
            <Button block variant="secondary" onClick={handleShareAction} loading={centerPayment.isLoading}>
              اشتراک گذاری
            </Button>
          </div>
          <div className="flex space-s-3">
            <Button block variant="secondary" onClick={handleMyTrunButtonAction} loading={centerPayment.isLoading}>
              نوبت های من
            </Button>
            <Button block variant="secondary" onClick={() => setRemoveModal(true)} loading={centerPayment.isLoading}>
              لغو نوبت
            </Button>
          </div>
          <Button
            block
            variant="secondary"
            onClick={() => centerMap({ lat: bookDetailsData.center_lat, lon: bookDetailsData.center_lon })}
            loading={centerPayment.isLoading}
          >
            مشاهده در نقشه و مسیریابی
          </Button>
        </div>
      </div>
      <div className="w-full md:w-[35rem] bg-white p-4 shadow-card rounded-lg mb-2 md:mb-0">
        <DoctorInfo
          className="bg-[#f8fafb] p-4 rounded-lg"
          avatar={publicRuntimeConfig.CLINIC_BASE_URL + bookDetailsData?.doctor_image}
          firstName={`دکتر ${bookDetailsData?.doctor_name}`}
          lastName={bookDetailsData?.doctor_family}
          expertise={getDisplayDoctorExpertise({
            aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
            degree: bookDetailsData?.expertises?.[0]?.degree?.name,
            expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
          })}
          isLoading={getBookDetails.isLoading || getBookDetails.isIdle}
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

Receipt.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithOutFooter>{page}</LayoutWithOutFooter>;
};

export default Receipt;
