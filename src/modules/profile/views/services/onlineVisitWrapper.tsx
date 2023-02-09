import { useGetFreeTurn } from '@/common/apis/services/booking/getFreeTurn';
import { useUnsuspend } from '@/common/apis/services/booking/unsuspend';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import useWebView from '@/common/hooks/useWebView';
import { CENTERS } from '@/common/types/centers';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import Recommend from '@/modules/booking/components/recommend/recommend';
import useBooking from '@/modules/booking/hooks/booking';
import SelectUserWrapper from '@/modules/booking/views/selectUser/wrapper';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import doctorMessengers from '@/modules/profile/constants/doctorMessengers.json';
import messengers from '@/modules/profile/constants/messengers.json';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OnlineVisit from './onlineVisit';

interface OnlineVisitWrapperProps {
  channelType: 'igap' | 'phone';
  doctorId: string;
  title: string;
  price: number;
  slug: string;
  id: string;
  userCenterId: string;
  duration?: string;
  city: {
    slug: string;
    name: string;
  };
  expertise: {
    slug: string;
    name: string;
  };
}

export const OnlineVisitWrapper = (props: OnlineVisitWrapperProps) => {
  const { channelType, doctorId, price, title, userCenterId, id, duration, city, expertise } = props;
  const { handleOpen: handleOpenBookingModal, handleClose: handleCloseBoolingModal, modalProps: bookingModalProps } = useModal();
  const { handleOpen: handleOpenRecommendModal, modalProps: recommendModalProps } = useModal();

  const freeTurn = useGetFreeTurn();
  const isWebView = useWebView();
  const [timeId, setTimeId] = useState('');
  const { handleBook: handleBooking, isLoading } = useBooking();
  const router = useRouter();
  const unSuspend = useUnsuspend();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();

  const checkLogin = (callback: () => any) => {
    if (!isLogin) return handleOpenLoginModal({ state: true, postLogin: callback });
    callback();
  };

  const handleOpenBooking = async () => {
    const { data } = await freeTurn.mutateAsync({
      center_id: CENTERS.CONSULT,
      service_id: id,
      type: isWebView ? 'app' : 'web',
      user_center_id: userCenterId,
    });

    if (data.status === ClinicStatus.SUCCESS) {
      setTimeId(data.result.request_code);
      handleOpenBookingModal();
      return;
    }
    handleOpenRecommendModal();
  };

  const handleBook = (user: any) => {
    handleBooking(
      {
        timeId,
        user,
        center: {
          id: CENTERS.CONSULT,
          server_id: '1',
        },
      },
      {
        onSuccess(data) {
          handleCloseBoolingModal();
          if (data.payment.reqiure_payment === '1') return router.push(`/factor/${CENTERS.CONSULT}/${data.book_info.id}`);
          router.push(`/receipt/${CENTERS.CONSULT}/${data.book_info.id}`);
        },
        onExpire() {
          handleCloseBoolingModal();
          checkLogin(handleOpenBooking);
        },
        onError(data) {
          handleCloseBoolingModal();
          unSuspend.mutate({ center_id: CENTERS.CONSULT, request_code: timeId });
          return toast.error(data.message);
        },
      },
    );
  };

  return (
    <>
      <OnlineVisit
        channel={channelType}
        messengers={doctorMessengers.find(({ id }: any) => id === doctorId)?.messengers}
        duration={duration}
        title={removeHtmlTagInString((title ?? 'ویزیت آنلاین') + ` (${messengers[channelType]?.name})`)}
        price={price}
        loading={freeTurn.isLoading}
        onBook={() => checkLogin(handleOpenBooking)}
      />
      <Modal
        title="انتخاب کاربر برای گفتگو با پزشک"
        {...bookingModalProps}
        onClose={() => {
          unSuspend.mutate({ center_id: CENTERS.CONSULT, request_code: timeId });
          bookingModalProps.onClose();
        }}
      >
        <div className="flex flex-col space-y-3">
          <div className="p-2 rounded-md bg-slate-100">
            <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: messengers[channelType]?.description }} />
          </div>
          <SelectUserWrapper
            className="pl-1 overflow-auto max-h-72 md:pb-0 pb-28"
            submitButtonText="ادامه"
            onSubmit={handleBook}
            loading={isLoading}
          />
        </div>
      </Modal>
      <Modal noHeader {...recommendModalProps} bodyClassName="bg-slate-100 !p-0">
        <div className="flex flex-col space-y-3">
          <Text className="p-5 leading-7 bg-white" fontWeight="bold">
            {freeTurn.data?.data?.message}
          </Text>
          <Text fontSize="sm" className="px-5 leading-6">
            برترین پزشکان{' '}
            <Text fontWeight="bold">
              {expertise?.name} {city?.name ? `در ${city?.name}` : null}
            </Text>{' '}
            از دیدگاه بیماران
          </Text>
          <Recommend doctorId={doctorId} city={city.slug} category={expertise.slug} />
        </div>
      </Modal>
    </>
  );
};
