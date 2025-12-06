import { useEstablishingSecureCall } from '@/common/apis/services/booking/establishingSecureCall';
import Button from '@/common/components/atom/button/button';
import { useFeatureValue } from '@growthbook/growthbook-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface EstablishingSecureCallParams {
  bookId: string;
  extraAction?: () => void;
}

export const SecureCallButton = ({ bookId, extraAction }: EstablishingSecureCallParams) => {
  const establishingSecureCall = useEstablishingSecureCall();
  const safeCallModuleInfo = useFeatureValue<any>('online_visit_secure_call', {});
  const handleEstablishingSecureCall = async () => {
    try {
      await establishingSecureCall.mutateAsync({ bookId });
      toast.success('درخواست شما با موفقیت ثبت شد');
      !!extraAction && extraAction();
      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };
  return (
    <>
      <Button variant="secondary" onClick={handleEstablishingSecureCall} loading={establishingSecureCall.isLoading} block>
        {!!safeCallModuleInfo.icon && <img src={safeCallModuleInfo.icon} width={25} height={25} className="mb-1" alt="Secure Call Icon" />}
        {safeCallModuleInfo.text}
      </Button>
    </>
  );
};
