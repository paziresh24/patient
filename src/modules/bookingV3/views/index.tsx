import { toast } from 'react-hot-toast';

// Apis

// Hooks
import { useEffect, useState } from 'react';

// Components
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';

// Booking Steps
import Wrapper from '../components/wrapper';
import SelectUserWrapper from './selectUser/wrapper';

// Analytics
import { sendGaEvent } from '@/common/services/sendGaEvent';

// Constants

// Global Store

// Types
import { useGetNationalCodeConfirmation } from '@/common/apis/services/booking/getNationalCodeConfirmation';
import Button from '@/common/components/atom/button';
import Skeleton from '@/common/components/atom/skeleton';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { convertNumberToStringGender } from '@/common/utils/convertNumberToStringGender';
import { providers } from '@/modules/profile/apis/providers';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useQuery } from '@tanstack/react-query';
import moment from 'jalali-moment';
import { useEasyAvailability } from '../apis/easyapp-availability';
import { easyChannels } from '../apis/easyapp-channels';
import { useEasyPidConverter } from '../apis/easyapp-pid';
import { useEasyProvider } from '../apis/easyapp-provder';
import { easyServices } from '../apis/easyapp-services';
import Invoice from '../components/factor/invoice';
import useBooking from '../hooks/booking';

interface BookingStepsProps {
  slug: string;
  className?: string;
}

const BookingSteps = (props: BookingStepsProps) => {
  const { customize } = useCustomize();
  const { slug, className } = props;
  const { data: providerResponse } = useQuery(['getProviders', slug], () => providers({ slug }));
  const providerData = providerResponse;
  const providerId = providerData?.id;
  const userId = providerData?.user_id;
  const { data: membershipResponse, isLoading: membershipLoading } = useEasyPidConverter(
    { provider_id: providerId },
    { enabled: !!providerId },
  );
  const getAvailability = useEasyAvailability();
  const messengers = useFeatureValue<any>('channeldescription', {});

  const membershipsData = {
    id: membershipResponse?.data?.ea_pid,
  };

  const { data: servicesResponose, isLoading: servicesLoading } = useEasyProvider(
    {
      ea_id: membershipsData.id,
    },
    { enabled: !!providerId && !membershipLoading },
  );

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    if (servicesResponose?.data?.services) {
      const servicesRequest = servicesResponose?.data?.services?.map(async (item: any) => await easyServices({ service_id: item }));

      Promise.all(servicesRequest).then(data => {
        console.log(data);

        Promise.all(data.map(async item => await easyChannels({ channel_id: item.data.categoryId }))).then((channels: any) => {
          setServices(
            data.map(item => ({
              ...item.data,
              channel: channels.find((channel: any) => channel.data.id === item.data.categoryId)?.data?.name,
            })),
          );
        });
      });
    }
  }, [servicesResponose]);

  const [user, setUser] = useState<any>({});

  const { handleOpen: handleOpenFactorModal, modalProps: factorModalProps } = useModal();
  const { handleBook, isLoading: bookLoading } = useBooking();
  const getNationalCodeConfirmation = useGetNationalCodeConfirmation();

  const handleBookAction = async (user: any) => {
    if (!user.messengerType) return toast.error('لطفا پیام رسان را انتخاب کنید.');
    const { insurance_id } = user;
    const userConfimation = getNationalCodeConfirmation.data?.data?.info;
    sendGaEvent({ action: 'P24DrsPage', category: 'book request button', label: 'book request button' });

    handleBook(
      {
        easybookProviderId: membershipsData?.id,
        easybookServiceId: services.find(service => service.channel === user.messengerType).id.toString(),
        time: getAvailability.data?.data?.first_availability!,
        providerId,
        userId,
        slug,
        user: {
          ...user,
          name: userConfimation?.name ?? user.name,
          family: userConfimation?.family ?? user.family,
          gender:
            userConfimation?.gender !== null && userConfimation?.gender !== undefined
              ? convertNumberToStringGender(userConfimation?.gender)
              : user.gender,
          insurance_id: insurance_id !== -1 ? insurance_id : null,
        },
      },
      {
        onSuccess(data) {
          location.assign(data.redirect_url);
        },
        onExpire(data) {
          toast.error(data.message, {
            duration: 10000,
          });
        },
        onError(data) {
          toast.error(data?.message, {
            duration: 10000,
          });
        },
      },
    );
  };

  return (
    <div className={classNames('p-5 bg-white rounded-lg', className)}>
      {services?.length === 1 && (
        <div className="p-2 mb-3 rounded-md bg-slate-100">
          <Text
            fontSize="sm"
            dangerouslySetInnerHTML={{
              __html: messengers[services[0]?.channel]?.description,
            }}
          />
        </div>
      )}

      <Wrapper
        title="لطفا بیمار را انتخاب کنید"
        Component={SelectUserWrapper}
        data={{
          loading: bookLoading || getNationalCodeConfirmation.isLoading,
          submitButtonText: 'ثبت نوبت',
          showTermsAndConditions: customize.showTermsAndConditions,
          shouldShowMessengers: services?.length > 1,
          messengers: services.map(service => service.channel),
        }}
        nextStep={async (user: any) => {
          if (!user.messengerType) {
            return toast.error('لطفا پیام رسان را انتخاب کنید.');
          }
          handleOpenFactorModal();
          user = {
            ...user,
            messengerType: user.messengerType ? user.messengerType : services?.[0]?.channel,
          };
          const { data } = await getAvailability.mutateAsync({
            provider_id: membershipsData.id,
            service_id: services.find(service => service.channel === user.messengerType).id,
          });

          setUser(user);
        }}
      />
      <Modal noHeader {...factorModalProps}>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col items-center justify-center space-y-1">
            <Text fontSize="sm">زمان شروع گفتگو: </Text>
            {getAvailability.isLoading && <Skeleton h="1.3rem" w="50%" rounded="full" className="!mt-2" />}
            {getAvailability.isSuccess && (
              <Text fontWeight="bold">
                {getAvailability.data?.data?.first_availability
                  ? moment.from(getAvailability.data?.data?.first_availability, 'en').locale('fa').calendar(undefined, {
                      sameDay: 'امروز (dddd) - ساعت: HH:mm',
                      nextDay: 'فردا (dddd) - ساعت: HH:mm',
                      sameElse: 'dddd jD jMMMM - ساعت: HH:mm',
                    })
                  : null}
              </Text>
            )}
          </div>

          <Invoice
            priceText={'ویزیت آنلاین'}
            price={(services.find(service => service.channel === user.messengerType)?.price * 10).toString()}
            totalPrice={(services.find(service => service.channel === user.messengerType)?.price * 10).toString()}
            tax={'0'}
            loading={getAvailability.isLoading || membershipLoading || servicesLoading}
          />
          <Button
            onClick={() => {
              handleBookAction({ ...user });
            }}
            loading={bookLoading || getAvailability.isLoading || membershipLoading || servicesLoading}
          >
            پرداخت
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookingSteps;
