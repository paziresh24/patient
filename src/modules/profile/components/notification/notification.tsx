import { useCancelAvailabilityNotification } from '@/common/apis/services/notifications/availability/cancel';
import { useExistsAvailabilityNotification } from '@/common/apis/services/notifications/availability/exists';
import { useSubmitAvailabilityNotification } from '@/common/apis/services/notifications/availability/submit';
import Alert from '@/common/components/atom/alert';
import Button from '@/common/components/atom/button';
import Card from '@/common/components/atom/card';
import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import BellIcon from '@/common/components/icons/bell';
import BellCheckIcon from '@/common/components/icons/bellCheck';
import EditIcon from '@/common/components/icons/edit';
import InfoIcon from '@/common/components/icons/info';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { phoneNumberValidator } from '@/common/utils/phoneNumberValidator';
import { phoneNumberWithZero } from '@/common/utils/phoneNumberWithZero';
import { useShowPremiumFeatures } from '@/modules/bamdad/hooks/useShowPremiumFeatures';
import { checkPremiumUser } from '@/modules/bamdad/utils/checkPremiumUser';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
interface NotificationProps {
  centerId: string;
  serviceId: string;
  userCenterId: string;
  availalbeTime: string;
  className?: string;
}

export const Notification = (props: NotificationProps) => {
  const router = useRouter();
  const { centerId, serviceId, userCenterId, availalbeTime, className } = props;

  const { handleOpen: handleOpenSubmitModal, handleClose: handleCloseSubmitModal, modalProps: submitModalProps } = useModal();
  const { handleOpen: handleOpenCancelModal, handleClose: handleCloseCancelModal, modalProps: cancelModalProps } = useModal();

  const userInfo = useUserInfoStore(state => state.info);
  const [isLogin, loginPending] = useUserInfoStore(state => [state.isLogin, state.pending]);
  const { handleOpenLoginModal } = useLoginModalContext();
  const phoneNumberField = useRef<HTMLInputElement | null>(null);
  const isShowPremiumFeatures = useShowPremiumFeatures();

  const exists = useExistsAvailabilityNotification(
    {
      center_id: centerId,
      service_id: serviceId,
      user_center_id: userCenterId,
    },
    {
      enabled: isLogin,
    },
  );
  const [isExists, setIsExists] = useState(false);
  const submit = useSubmitAvailabilityNotification();
  const cancel = useCancelAvailabilityNotification();

  useEffect(() => {
    if (exists.data) {
      setIsExists(!!exists.data?.data?.data);
    }
  }, [exists.data]);

  const handleSubmit = async () => {
    if (!phoneNumberField.current || !phoneNumberValidator(phoneNumberField.current?.value ?? '')) {
      toast.error('شماره همراه را به صورت صحیح وارد نمایید');
      return;
    }
    try {
      await submit.mutateAsync({
        center_id: centerId,
        service_id: serviceId,
        user_center_id: userCenterId,
        cell: phoneNumberWithZero(phoneNumberField.current.value),
      });
      setIsExists(true);
      splunkInstance('doctor-profile').sendEvent({
        group: 'bamdad',
        type: 'notify-me',
        event: {
          center_id: centerId,
          service_id: serviceId,
          user_center_id: userCenterId,
          availalbe_time: availalbeTime,
        },
      });
      handleCloseSubmitModal();
    } catch (error) {
      if (axios.isAxiosError(error)) return toast.error(error.response?.data?.message);
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync({
        center_id: centerId,
        service_id: serviceId,
        user_center_id: userCenterId,
      });
      setIsExists(false);
      handleCloseCancelModal();
    } catch (error) {
      if (axios.isAxiosError(error)) return toast.error(error.response?.data?.message);
    }
  };

  const handleClickOpenSubmmitModal = () => {
    if (!isLogin) {
      handleOpenLoginModal({
        state: true,
        postLogin: user => {
          if (!checkPremiumUser(user.vip)) return router.push('/patient/premium');
          exists.refetch();
        },
      });

      return;
    }

    if (checkPremiumUser(userInfo.vip)) return handleOpenSubmitModal();
    router.push('/patient/premium');
  };

  return (
    <>
      <Card className={classNames('space-y-3', className)}>
        <Alert severity="warning" className="flex items-center p-3 text-orange-600 space-s-1">
          <InfoIcon className="w-6 h-6" />
          <Text className="text-sm font-medium">زمان نوبت دهی پزشک به پایان رسیده است.</Text>
        </Alert>
        <div className="flex justify-between text-sm">
          <Text className="text-slate-500">زمان اعلام نوبت های جدید: </Text>
          <Text fontWeight="medium" className="text-slate-800">
            {availalbeTime}
          </Text>
        </div>

        {isShowPremiumFeatures && ((exists.isLoading && isLogin) || loginPending) && (
          <Loading className="self-center w-8 h-5 fill-slate-400" />
        )}
        {isShowPremiumFeatures && ((exists.isSuccess && !isExists) || (!isLogin && !loginPending)) && (
          <Button onClick={handleClickOpenSubmmitModal} icon={<BellIcon />}>
            نوبت دار شد، به من اطلاع بده
          </Button>
        )}
        {exists.isSuccess && isExists && (
          <div className="flex flex-col space-y-1 cursor-pointer" onClick={handleOpenCancelModal}>
            <div className="flex items-center p-3 rounded-md rounded-b-none bg-teal-100/40 space-s-1">
              <BellCheckIcon className="w-6 h-6 text-emerald-500" />
              <Text fontSize="sm" fontWeight="medium" className="text-emerald-500">
                با فعال شدن امکان نوبت دهی، به شما اطلاع رسانی خواهد شد.
              </Text>
            </div>
            <div className="flex items-center p-3 rounded-md rounded-t-none bg-teal-100/40 space-s-1">
              <Text fontSize="sm" fontWeight="medium" className="text-slate-600">
                کاربر گرامی، در نظر داشته باشید این اعلام باز شدن نوبت ها به منزله دریافت نوبت توسط پذیرش 24 نمی باشد و صرفا جنبه اطلاع
                رسانی دارد.
              </Text>
            </div>
          </div>
        )}
      </Card>
      <Modal {...submitModalProps} title="اطلاع رسانی امکان دریافت نوبت">
        <div className="flex flex-col space-y-3">
          <Text fontWeight="medium" fontSize="sm" className="leading-6">
            به چه شماره موبایلی اطلاع رسانی شود؟
          </Text>
          <div className="flex items-center justify-between p-3 border border-blue-400 rounded-lg bg-blue-300/10">
            <Text fontSize="sm" fontWeight="medium">
              شماره موبایل:
            </Text>
            <div className="flex items-center space-s-1">
              <input
                defaultValue={userInfo.cell}
                ref={phoneNumberField}
                dir="ltr"
                className="w-auto h-5 text-sm text-left bg-transparent outline-none appearance-none"
              />
              <EditIcon className="w-5 h-5 cursor-pointer" onClick={() => phoneNumberField.current?.focus()} />
            </div>
          </div>
          <Button block onClick={handleSubmit} loading={submit.isLoading}>
            تایید
          </Button>
        </div>
      </Modal>
      <Modal {...cancelModalProps} title="لغو اطلاع رسانی">
        <div className="flex flex-col space-y-2">
          <Text fontWeight="medium" fontSize="sm" className="leading-6">
            آیا تمایل دارید اطلاع رسانی امکان دریافت نوبت لغو شود؟
          </Text>
          <div className="flex space-s-2">
            <Button theme="error" variant="secondary" block onClick={handleCancel} loading={cancel.isLoading}>
              لغو اطلاع رسانی
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Notification;
