import { apiGatewayClient } from '@/common/apis/client';
import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useConsultInvoice } from '@/common/apis/services/factor/consultInvoice';
import { CENTERS } from '@/common/types/centers';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export const useInvoice = ({
  bookId,
  centerId,
  serviceId,
  userCenterId,
}: {
  bookId?: string;
  centerId: string;
  serviceId?: string;
  userCenterId?: string;
}) => {
  const getBookDetails = useGetBookDetails();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const getConsultInvoice = useConsultInvoice();
  const [invoiceDetails, setInvoiceDetails] = useState<{
    totalPrice?: string;
    price?: string;
    tax?: string;
  }>({});

  useEffect(() => {
    if (serviceId ? !!userCenterId : bookId && isLogin) {
      const requests = [
        bookId &&
          getBookDetails.mutateAsync({
            book_id: bookId.toString(),
            type: 'factor',
          }),
        centerId === CENTERS.CONSULT &&
          bookId &&
          getConsultInvoice.mutateAsync({
            book_id: bookId,
          }),
      ].filter(Boolean) as Promise<AxiosResponse<any, any>>[];

      if (!bookId && serviceId) {
        apiGatewayClient('/v1/service-price', {
          params: {
            center_id: centerId,
            service_id: serviceId,
            user_center_id: userCenterId,
          },
        }).then(data => {
          setInvoiceDetails({
            totalPrice: data.data?.result?.payable_cost,
            price: data.data?.result?.service_price,
            tax: data?.data?.result?.vat,
          });
        });

        return;
      }

      Promise.all(requests).then(([getBook, consultInvoice]) => {
        if (centerId === CENTERS.CONSULT) {
          setInvoiceDetails({
            totalPrice: consultInvoice?.data?.result?.book_price,
            price: consultInvoice?.data?.result?.service_price,
            tax: consultInvoice?.data?.result?.vat,
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
  }, [bookId, centerId, isLogin, userCenterId, serviceId]);

  return { ...invoiceDetails, isLoading: getBookDetails.isLoading || getConsultInvoice.isLoading };
};

export default useInvoice;
