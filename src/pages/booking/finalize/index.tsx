import { apiGatewayClient } from '@/common/apis/client';
import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useGetReceiptDetails } from '@/common/apis/services/booking/getReceiptDetails';
import { useGetOnlineChannels } from '@/common/apis/services/booking/onlineChannels';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import Loading from '@/common/components/atom/loading/loading';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import Transition from '@/common/components/atom/transition/transition';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { CENTERS } from '@/common/types/centers';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { defaultMessengers } from '@/modules/booking/constants/defaultMessengers';
import { uniqMessengers } from '@/modules/booking/functions/uniqMessengers';
import BookingSteps from '@/modules/booking/views';
import SelectUserWrapper from '@/modules/booking/views/selectUser/wrapper';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import { useFeatureValue } from '@growthbook/growthbook-react';
import axios from 'axios';
import moment from 'jalali-moment';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
const { publicRuntimeConfig } = getConfig();

const Booking = () => {
  const router = useRouter();
  const {
    query: { book_id: bookId, callback_url },
  } = useRouter();
  const setProfileData = useProfileDataStore(state => state.setData);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();
  const getBookDetails = useGetBookDetails();
  const bookDetailsData = useMemo(() => getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0], [getBookDetails.status]);
  const messengers = useFeatureValue<any>('channeldescription', defaultMessengers);
  const { data: onlineChannelsData, isLoading: onlineChannelLoading } = useGetOnlineChannels({ book_id: bookId as string });
  const onlineChannels = (onlineChannelsData?.data as string[]) ?? [];
  const doctorMessenger = uniqMessengers(onlineChannels, Object.keys(messengers));

  useEffect(() => {
    if (!isLogin && !userPending) {
      handleOpenLoginModal({ state: true });
    }
    if (bookId && isLogin && !userPending)
      getBookDetails.mutate({
        book_id: bookId.toString(),
        type: 'factor',
      });
  }, [bookId, isLogin, userPending]);

  const doctorName = `${bookDetailsData?.doctor_name} ${bookDetailsData?.doctor_family}`;

  const isLoading = getBookDetails.isLoading || getBookDetails?.isIdle || onlineChannelLoading;

  const [updateBookDetailsLoading, setUpdateBookDetailsLoading] = useState(false);

  useEffect(() => {
    setProfileData({
      online_visit_channel_types: onlineChannels,
    });
  }, [onlineChannels]);

  const handleUpdateBookDetails = async (userInfo: any) => {
    setUpdateBookDetailsLoading(true);
    try {
      await toast.promise(
        apiGatewayClient.patch(`/v1/book/${bookId}`, {
          name: userInfo.name,
          family: userInfo.family,
          ...(userInfo.national_code && { national_code: userInfo.national_code }),
          cell: userInfo.cell ? (!userInfo.cell?.startsWith('0') ? `0${userInfo.cell}` : userInfo.cell) : null,
          online_channel: userInfo.messengerType,
          ...(!userInfo.cell && { cell_country_prefix: 1 }),
        }),
        {
          loading: 'درحال نهایی سازی...',
        },
        {
          id: 'handleUpdateBookDetails',
        },
      );

      location.replace(callback_url as string);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
      setUpdateBookDetailsLoading(false);
    }
  };

  return (
    <>
      <Seo title={`دریافت نوبت ${bookDetailsData?.doctor_name ? `از ${doctorName}` : ''}`} noIndex />
      <div className="flex flex-col-reverse items-start w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="flex flex-col w-full bg-white md:basis-4/6 md:rounded-lg shadow-card mb-28">
          {isLoading && (
            <div className="self-center p-10">
              <Loading className="self-center" />
            </div>
          )}
          <Transition match={!isLoading} animation="bottom">
            <div className="p-5 bg-white rounded-lg">
              <div className="flex flex-col space-y-3">
                {onlineChannels?.filter((item: any) => item !== 'secure_call')?.length <= 1 && (
                  <div className="p-2 mb-3 rounded-md bg-slate-100">
                    <Text
                      fontSize="sm"
                      dangerouslySetInnerHTML={{
                        __html: messengers[doctorMessenger?.[0] ?? 'phone']?.description,
                      }}
                    />
                  </div>
                )}
                <Text fontWeight="bold">لطفا بیمار را انتخاب کنید</Text>
                <SelectUserWrapper
                  loading={updateBookDetailsLoading || isLoading}
                  onSubmit={(userInfo: any) => {
                    if (!userInfo?.messengerType && onlineChannels?.filter((item: any) => item !== 'secure_call')?.length > 1) {
                      toast.error('لطفا پیام رسان را انتخاب کنید.');
                      return;
                    }
                    handleUpdateBookDetails({
                      ...userInfo,
                      messengerType: userInfo?.messengerType ?? onlineChannels?.filter((item: any) => item !== 'secure_call')[0],
                    });
                  }}
                  shouldShowMessengers={onlineChannels?.filter((item: any) => item !== 'secure_call')?.length > 1}
                  submitButtonText="نهایی سازی و آغاز گفتگو"
                  showTermsAndConditions={false}
                />
              </div>
            </div>
          </Transition>
        </div>
        <div className="w-full p-3 mb-2 space-y-3 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
          <DoctorInfo
            className="p-4 rounded-lg bg-slate-100"
            isLoading={isLoading}
            avatar={publicRuntimeConfig.CDN_BASE_URL + bookDetailsData?.doctor_image}
            fullName={doctorName}
            expertise={getDisplayDoctorExpertise({
              aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
              degree: bookDetailsData?.expertises?.[0]?.degree?.name,
              expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
            })}
          />
        </div>
      </div>
    </>
  );
};

Booking.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} showBottomNavigation={false} {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    const { id, center_id } = context.query;
    if (id && center_id) {
      return {
        redirect: {
          statusCode: 302,
          destination: `/receipt/${center_id}/${id}`,
        },
      };
    }

    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Booking;
