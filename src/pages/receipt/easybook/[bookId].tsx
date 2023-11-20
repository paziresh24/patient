import { useGetServerTime } from '@/common/apis/services/general/getServerTime';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import Alert from '@/common/components/atom/alert';
import Button from '@/common/components/atom/button';
import Chips from '@/common/components/atom/chips';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import Timer from '@/common/components/atom/timer';
import SuccessIcon from '@/common/components/icons/success';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useModal from '@/common/hooks/useModal';
import { useRemovePrefixDoctorName } from '@/common/hooks/useRemovePrefixDoctorName';
import classNames from '@/common/utils/classNames';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { useEasyAppointments } from '@/modules/bookingV3/apis/easyapp-appointments';
import { useEasyChannels } from '@/modules/bookingV3/apis/easyapp-channels';
import { useEasyCustomers } from '@/modules/bookingV3/apis/easyapp-customer';
import { useEasyServices } from '@/modules/bookingV3/apis/easyapp-services';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import MessengerButton from '@/modules/myTurn/components/messengerButton/messengerButton';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { useProviders } from '@/modules/profile/apis/providers';
import BookInfo from '@/modules/receipt/views/bookInfo/bookInfo';
import moment from 'jalali-moment';
import md5 from 'md5';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo, useState } from 'react';
const { publicRuntimeConfig } = getConfig();

const Receipt = () => {
  const {
    query: { bookId, pincode, slug },
    ...router
  } = useRouter();
  const user = useUserInfoStore(state => state.info);

  const { handleOpen: handleOpenWaitingTimeFollowUpModal, modalProps: waitingTimeFollowUpModalProps } = useModal();
  const [isWattingTimeFollowUpLoadingButton, setIsWattingTimeFollowUpLoadingButton] = useState(false);

  const getProvider = useProviders();
  const getProfileImage = useGetProfileData({ slug: slug as string });
  const getAppoinment = useEasyAppointments({ id: bookId as string });
  const getService = useEasyServices(
    { service_id: getAppoinment.data?.data?.serviceId },
    { enabled: !!getAppoinment.data?.data?.serviceId },
  );

  const getChannel = useEasyChannels({ channel_id: getService.data?.data?.categoryId }, { enabled: !!getService.data?.data?.categoryId });
  const getCustomer = useEasyCustomers({ id: getAppoinment.data?.data?.customerId }, { enabled: !!getAppoinment.data?.data?.customerId });

  useEffect(() => {
    getProvider.mutateAsync({ slug: slug as string });
  }, []);

  const isLogin = useUserInfoStore(state => state.isLogin);
  const userPednding = useUserInfoStore(state => state.pending);
  const serverTime = useGetServerTime();
  const centerType = CenterType.consult;

  const removePrefixDoctorName = useRemovePrefixDoctorName();

  useEffect(() => {
    if (!pincode && !isLogin && !userPednding) {
      router.replace(`/login?redirect_url=${router.asPath}`);
    }
  }, [isLogin, userPednding, pincode]);

  const duration = moment.duration(
    moment(getAppoinment?.data?.data?.start)
      .add(1, 'hour')
      .diff(moment(serverTime?.data?.data?.data.timestamp * 1000)),
  );

  let minutes = Math.floor(duration.minutes());
  let seconds = Math.floor(duration.seconds());

  let formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    // Prefetch the doctor profile page
    router.prefetch('/patient/appointments');
  }, []);

  const statusText = useMemo(() => {
    return 'نوبت شما با موفقیت ثبت شد';
  }, [centerType]);

  return (
    <>
      <Seo title="رسید نوبت" noIndex />
      <div className="flex flex-col-reverse items-start w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="w-full p-5 space-y-6 bg-white md:basis-4/6 md:rounded-lg shadow-card">
          <div id="receipt" className="flex flex-col space-y-4">
            {!!statusText && (
              <>
                {getAppoinment.isSuccess ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <SuccessIcon className="text-green-600" />
                    <Text fontWeight="bold" className={classNames('text-green-600')}>
                      {statusText}
                    </Text>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center w-full">
                      <Skeleton w="2.9rem" h="2.9rem" rounded="full" className="mb-4" />
                      <Skeleton w="10rem" h="1.1rem" rounded="md" />
                    </div>
                  </>
                )}
              </>
            )}
            <BookInfo
              turnData={{
                selected_online_visit_channel: {
                  type: getChannel.data?.data?.name,
                },
                patient: {
                  name: getCustomer?.data?.data?.firstName,
                  family: getCustomer?.data?.data?.lastName,
                  cell: getCustomer?.data?.data?.phone,
                },
                share_url: '',
                duration_conversation_doctor: 3,
                book_time_string: moment(getAppoinment?.data?.data?.start).locale('fa').format('jYYYY/jMM/DD HH:mm'),
                is_online_visit: true,
              }}
              loading={getChannel.isLoading || getAppoinment.isLoading || getService.isLoading}
              centerId={'5532'}
            />
          </div>

          {(getChannel.isLoading || getAppoinment.isLoading || getService.isLoading) && (
            <>
              <div className="!mt-3">
                <Skeleton w="100%" h="2.8rem" rounded="lg" />
              </div>
            </>
          )}

          {getChannel.data?.data?.name && (
            <div className="grid gap-2">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-4">
                <MessengerButton
                  channel={{
                    type: getChannel.data?.data?.name,
                    channel_link: '',
                    channel: '',
                  }}
                />
              </div>

              {serverTime?.data?.data?.data.timestamp > moment(getAppoinment?.data?.data?.start).unix() && (
                <>
                  <Divider />
                  <div className="flex relative  flex-col space-y-2">
                    <Button
                      size="sm"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      block
                      variant="secondary"
                      onClick={handleOpenWaitingTimeFollowUpModal}
                      disabled={serverTime?.data?.data?.data.timestamp < moment(getAppoinment?.data?.data?.start).add(1, 'hour').unix()}
                    >
                      پیگیری تاخیر پزشک
                      {serverTime?.data?.data?.data.timestamp < moment(getAppoinment?.data?.data?.start).add(1, 'hour').unix() && (
                        <Chips>
                          <Timer
                            defaultTime={formattedDuration}
                            target={moment(getAppoinment?.data?.data?.start).add(1, 'hour').unix() - serverTime?.data?.data?.data.timestamp}
                            className="!text-slate-800 font-medium"
                          />
                        </Chips>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      className="border-slate-300 text-slate-500 hover:bg-slate-50"
                      block
                      variant="secondary"
                      onClick={() =>
                        location.assign(
                          `https://support.paziresh24.com/ticketbyturn/?book-id=${getAppoinment.data?.data?.id}&pincode=${
                            (pincode as string) ?? (user.id && md5(user.id))
                          }`,
                        )
                      }
                    >
                      درخواست پشتیبانی این نوبت
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="w-full p-3 mb-2 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
          <DoctorInfo
            className="p-4 rounded-lg bg-slate-50"
            {...(getProfileImage.data?.data?.image && { avatar: publicRuntimeConfig.CLINIC_BASE_URL + getProfileImage.data?.data?.image })}
            fullName={removePrefixDoctorName(getProfileImage.data?.data?.display_name)}
            expertise={getDisplayDoctorExpertise({
              aliasTitle: getProfileImage.data?.data?.expertises?.[0]?.alias_title,
              degree: getProfileImage.data?.data?.expertises?.[0]?.degree?.name,
              expertise: getProfileImage.data?.data?.expertises?.[0]?.expertise?.name,
            })}
            isLoading={getProfileImage.isLoading}
          />
        </div>
        {/* <Modal
          title={
            centerType === 'consult'
              ? `لطفا دلیل ${turnStatus.notVisitedTurn ? 'لغو نوبت' : 'درخواست استرداد وجه'} را انتخاب کنید`
              : 'آیا از لغو نوبت اطمینان دارید؟'
          }
          {...removeModalProps}
        >
          <div className="flex flex-col gap-3 mb-3">
            {centerId === CENTERS.CONSULT &&
              (turnStatus.notVisitedTurn ? deleteTurnQuestionBefforVisit : deleteTurnQuestionAffterVisit).map((question: any) => (
                <Select
                  key={question.id}
                  selected={reasonDeleteTurn === question.value}
                  onSelect={() => setReasonDeleteTurn(question.value)}
                  title={question.text}
                />
              ))}
          </div>
          <div className="flex space-s-2">
            <Button theme="error" block onClick={handleRemoveBookTurn} loading={removeBookApi.isLoading}>
              لغو نوبت
            </Button>
            <Button theme="error" variant="secondary" block onClick={handleCloseRemoveModal}>
              انصراف
            </Button>
          </div>
        </Modal> */}
        <Modal {...waitingTimeFollowUpModalProps} title="پیگیری تاخیر پزشک">
          <form
            method="post"
            onSubmit={() => setIsWattingTimeFollowUpLoadingButton(true)}
            action="https://n8n.paziresh24.com/webhook/doctordelayfollowup"
            className="flex flex-col space-y-3"
          >
            <Alert severity="warning" className="p-2">
              <Text fontWeight="medium" fontSize="sm" className="text-orange-700">
                با ارسال این فرم شما تایید می کنید که در زمان مقرر در پیامرسان انتخاب شده به پزشک پیام ارسال کرده اید و هنوز پاسخی دریافت
                نکرده اید.
              </Text>
            </Alert>
            <input name="book-id" value={getAppoinment.data?.data?.id} type="hidden" />
            <input name="pincode" value={(pincode as string) ?? (user.id && md5(user.id))} type="hidden" />
            <TextField name="description" label="توضیحات" multiLine className="h-28" />
            <Button type="submit" loading={isWattingTimeFollowUpLoadingButton}>
              ارسال درخواست پیگیری
            </Button>
          </form>
        </Modal>
      </div>
    </>
  );
};

const ReceiptButtonLoading = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
      </div>
      <div className="flex justify-between items-center !mt-3">
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
      </div>
      <div className="!mt-3">
        <Skeleton w="100%" h="2.8rem" rounded="lg" />
      </div>
    </>
  );
};

Receipt.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Receipt;
