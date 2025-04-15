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
  }>({});

  const handleDiscountSubmit = async (code: string) => {
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
