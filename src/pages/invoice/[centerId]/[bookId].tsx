import { useGetReceiptDetails } from '@/common/apis/services/booking/getReceiptDetails';
import Button from '@/common/components/atom/button/button';
import Loading from '@/common/components/atom/loading/loading';
import Logo from '@/common/components/atom/logo/logo';
import Text from '@/common/components/atom/text/text';
import ErrorIcon from '@/common/components/icons/error';
import PrinterIcon from '@/common/components/icons/printer';
import ShareIcon from '@/common/components/icons/share';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useShare from '@/common/hooks/useShare';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { addCommas } from '@persian-tools/persian-tools';
import md5 from 'md5';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useMemo } from 'react';

const Invoice = () => {
  const {
    query: { bookId, centerId, pincode },
  } = useRouter();
  const share = useShare();

  const userId = useUserInfoStore(state => state.info.id);

  const userPincode = (pincode as string) ?? (userId && md5(userId));
  const getReceiptDetails = useGetReceiptDetails({
    book_id: bookId as string,
    center_id: centerId as string,
    pincode: userPincode,
  });

  const bookDetailsData = useMemo(() => getReceiptDetails.isSuccess && getReceiptDetails.data?.data?.data, [getReceiptDetails.status]);

  const bookInfo = [
    {
      name: 'کدپیگیری',
      value: bookDetailsData?.reference_code,
    },
    {
      name: 'نام',
      value: `${bookDetailsData?.patient?.name ?? ''} ${bookDetailsData?.patient?.family ?? ''}`,
    },
    {
      name: 'کدملی',
      value: bookDetailsData?.patient?.national_code,
    },
    {
      name: 'تاریخ نوبت',
      value: bookDetailsData?.book_time_string,
    },
    {
      name: 'نام پزشک',
      value: bookDetailsData?.doctor?.display_name,
    },
  ];
  const isShowInvoice = !bookDetailsData.is_deleted && bookDetailsData.book_status !== BookStatus.notVisited;

  if (getReceiptDetails.isLoading)
    return (
      <div className="flex items-center justify-center flex-grow bg-white">
        <Loading />
      </div>
    );

  return (
    <div className="relative flex-grow p-0 bg-white print:p-0 md:py-14">
      {!isShowInvoice && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center space-y-4 bg-white/80">
          <ErrorIcon className="text-red-600" />
          <Text fontSize="lg" fontWeight="bold" className="text-red-600">
            شرایط نمایش فاکتور وجود ندارد
          </Text>
        </div>
      )}
      <div className="flex flex-col w-full p-5 mx-auto bg-white border-dashed rounded-md md:w-3/6 print:w-full print:p-8 md:p-8 print:border md:border border-slate-300">
        <div className="flex items-center justify-between mb-6">
          <Logo fontSize="lg" width={45} />
          <h1 className="hidden font-bold md:block print:block">فاکتور نوبت</h1>
          <div className="flex flex-col space-y-1 text-sm">
            <span>
              تاریخ چاپ:{' '}
              {new Date().toLocaleDateString('fa', {
                dateStyle: 'medium',
              })}
            </span>
            <span>
              زمان چاپ:{' '}
              {new Date().toLocaleTimeString('fa', {
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm print:grid-cols-3 print:text-base md:text-base md:grid-cols-3">
          {bookInfo.map(item => (
            <div className="space-s-1" key={item.name}>
              <span>{item.name}</span>:<span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
        <table className="table-fixed">
          <thead>
            <tr>
              {['ردیف', 'توضیحات', 'قیمت (ریال)', 'تخفیف (ریال)', 'مبلغ نهایی (ریال)'].map(col => (
                <th key={col} className="p-2 text-sm text-center border border-slate-200">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookDetailsData.services?.map((item: any, index: number) => (
              <tr key={item.id}>
                {[
                  index + 1,
                  item.title,
                  addCommas(item.service_free_price ?? 0),
                  addCommas(item.discount ?? 0),
                  addCommas(item.cost ?? 0),
                ].map(col => (
                  <td key={col} className="p-3 text-center border border-slate-200">
                    {col}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="p-3 font-bold border text-end border-slate-200">
                جمع هزینه ها:
              </td>
              <td className="p-3 font-bold text-center border border-slate-200">
                {addCommas((bookDetailsData.services as any[])?.reduce((prev, current) => (prev += current.cost ?? 0), 0))}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="py-6 pe-11 text-end">
          <span>مهر و امضاء</span>
        </div>
        <div className="flex self-end space-s-2 print:hidden">
          <Button
            size="sm"
            variant="secondary"
            icon={<ShareIcon className="w-5 h-5" />}
            onClick={() =>
              share({
                url: window.location.href + `?pincode=${userPincode}`,
              })
            }
          >
            اشتراک گذاری
          </Button>
          <Button onClick={() => window.print()} size="sm" icon={<PrinterIcon className="w-5 h-5" />}>
            چاپ
          </Button>
        </div>
      </div>
    </div>
  );
};

Invoice.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Seo title="فاکتور نوبت" noIndex />

      <LayoutWithHeaderAndFooter {...page.props.config} shouldShowPromoteApp={false} shouldShowBrand={false} compactFooter>
        {page}
      </LayoutWithHeaderAndFooter>
    </>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Invoice;
