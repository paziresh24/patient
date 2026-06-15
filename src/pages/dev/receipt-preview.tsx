import SuccessIcon from '@/common/components/icons/success';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import BookInfo from '@/modules/receipt/views/bookInfo/bookInfo';
import { GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';

const MOCK_CENTER_ID = '1001';
const MOCK_BOOK_ID = '60190091876';

const mockTurnData = {
  book_id: MOCK_BOOK_ID,
  book_time_string: '۱۷ خرداد ۱۴۰۳ - ۱۳:۰۰',
  book_status: 'not_visited',
  reference_code: '60190091876',
  is_deleted: false,
  is_online_visit: false,
  center: {
    name: 'توسعه دهندگان پذیرش ۲۴ - همدست',
    display_number: '021',
    address: '-',
  },
  doctor: {
    display_name: 'دکتر محمد محمدی',
  },
  patient: {
    name: 'کاربر',
    family: 'تست',
    cell: '9123456789',
    national_code: '1234567890',
  },
  services: [{ title: 'ویزیت', id: 1 }],
  share_url: 'https://www.paziresh24.com/receipt/preview',
};

const ReceiptPreview = () => {
  return (
    <>
      <Seo title="پیش‌نمایش قبض نوبت (Dev)" noIndex />
      <div className="flex flex-col w-full max-w-screen-lg mx-auto md:py-10 px-5">
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          این صفحه فقط برای تست UI در محیط development است و به API واقعی وصل نیست.
        </div>
        <div className="bg-white md:rounded-lg shadow-card p-5">
          <div className="flex flex-col items-center justify-center space-y-3 mb-4">
            <SuccessIcon className="text-green-600" />
            <Text fontWeight="bold" className="text-green-600">
              نوبت شما با موفقیت ثبت شد
            </Text>
          </div>
          <BookInfo
            turnData={mockTurnData}
            loading={false}
            centerId={MOCK_CENTER_ID}
            bookId={MOCK_BOOK_ID}
            possibilityBeingVisited
          />
        </div>
      </div>
    </>
  );
};

ReceiptPreview.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    if (process.env.NODE_ENV !== 'development') {
      return { notFound: true };
    }

    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default ReceiptPreview;
