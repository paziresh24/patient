import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useConsultInvoice } from '@/common/apis/services/factor/consultInvoice';
import { CENTERS } from '@/common/types/centers';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export const useInvoice = ({ bookId, centerId }: { bookId: string; centerId: string }) => {
  const getBookDetails = useGetBookDetails();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const getConsultInvoice = useConsultInvoice();
  const [invoiceDetails, setInvoiceDetails] = useState<{
    totalPrice?: string;
    price?: string;
    tax?: string;
  }>({});

  useEffect(() => {
    if (bookId && isLogin) {
      const requests = [
        getBookDetails.mutateAsync({
          book_id: bookId.toString(),
          type: 'factor',
        }),
        centerId === CENTERS.CONSULT &&
          getConsultInvoice.mutateAsync({
            book_id: bookId,
          }),
      ].filter(Boolean) as Promise<AxiosResponse<any, any>>[];

      Promise.all(requests).then(([getBook, consultInvoice]) => {
        if (centerId === CENTERS.CONSULT) {
          setInvoiceDetails({
            totalPrice: consultInvoice.data.result?.book_price,
            price: consultInvoice.data.result?.service_price,
            tax: consultInvoice.data.result?.vat,
          });
          return;
        }
        const reformattedData = getBook.data?.result?.[0];
        setInvoiceDetails({
          totalPrice: reformattedData?.book_payable_cost,
          price: reformattedData?.book_payable_cost,
        });
      });
    }
  }, [bookId, centerId, isLogin]);

  return { ...invoiceDetails, isLoading: getBookDetails.isLoading || getConsultInvoice.isLoading };
};

export default useInvoice;
