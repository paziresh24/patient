import { apiGatewayClient } from '@/common/apis/client';
import { useDiscountInquiry } from '@/common/apis/services/factor/discountInquiry';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { useState } from 'react';

export const useDiscount = ({
  bookId,
  centerId,
  serviceId,
  userCenterId,
}: {
  bookId: string;
  centerId?: string;
  serviceId?: string;
  userCenterId?: string;
}) => {
  const discountInquiry = useDiscountInquiry();
  const [invoiceDetails, setInvoiceDetails] = useState<{
    totalPrice?: string;
    discount?: string;
    discountToken?: string;
    tax?: string;
    isValidDiscount?: boolean;
    discountErrorMessage?: string;
    code?: string;
  }>({});

  const handleDiscountSubmit = async (code: string) => {
    if (!bookId && serviceId && centerId && userCenterId) {
      const { data } = await apiGatewayClient.get('https://apigw.paziresh24.com/v1/discount/inquiry', {
        params: {
          user_center_id: userCenterId,
          center_id: centerId,
          code: code,
          service_id: serviceId,
        },
      });

      if (data?.status == 1) {
        setInvoiceDetails(prev => ({
          ...prev,
          totalPrice: data.result?.payable_cost,
          discount: data.result?.discount_price,
          tax: data.result?.vat,
          isValidDiscount: true,
          code: code,
        }));
        return;
      }
      setInvoiceDetails(prev => ({
        ...prev,
        isValidDiscount: false,
        discountErrorMessage: data.message,
      }));

      return;
    }
    const { data } = await discountInquiry.mutateAsync({
      book_id: bookId,
      centerId,
      serviceId,
      userCenterId,
      code,
    });
    if (data?.status === ClinicStatus.SUCCESS) {
      setInvoiceDetails(prev => ({
        ...prev,
        totalPrice: data.result?.payable_cost,
        discount: data.result?.discount_price,
        tax: data.result?.vat,
        discountToken: data.result?.token,
        isValidDiscount: true,
      }));
      return;
    }
    setInvoiceDetails(prev => ({
      ...prev,
      isValidDiscount: false,
      discountErrorMessage: data.message,
    }));
  };

  return { ...invoiceDetails, handleDiscountSubmit, discountLoading: discountInquiry.isLoading };
};

export default useDiscount;
