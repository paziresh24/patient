import Skeleton from '@/common/components/atom/skeleton';
import useCustomize from '@/common/hooks/useCustomize';
import BaseRow from '@/modules/booking/components/baseRow/baseRow';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { VisitChannels } from '../../constants/onlineVisitChannels';
import { turnDetailsData } from './turnDetails';

interface PaymentDetailsProps {
  loading: boolean;
  turnData: any;
  centerId: string;
  possibilityBeingVisited?: boolean;
}

export const BookInfo = (props: PaymentDetailsProps) => {
  const { loading = false, turnData, centerId, possibilityBeingVisited } = props;
  const specialDoctorList = useFeatureValue<any[]>('rocketchat_doctor_list', []);
  const specialServiceInfo = specialDoctorList.find((service: any) => service.service_id === turnData?.services?.[0]?.id);
  const messengers = useFeatureValue<any>('onlinevisitchanneltype', {});
  const messengerButtonType = useFeatureValue('receipt:messenger-button-type', 'OUTLINE');
  const isConsultReceipt = centerId === '5532';
  const { customize } = useCustomize();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col pt-1 border border-solid divide-y rounded-lg divide-dashed border-slate-200 divide-slate-100">
        {loading && (
          <>
            <div className="flex items-center justify-between px-5 py-3">
              <Skeleton w="10rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <Skeleton w="6rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <Skeleton w="8rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <Skeleton w="12rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
          </>
        )}
        {!loading &&
          turnDetailsData({
            data: {
              bookTime: turnData.book_time_string,
              centerName: turnData.center?.name,
              trackingCode: turnData.reference_code,
              waitingTime: turnData?.center?.waiting_time,
              centerPhone: turnData?.center?.display_number,
              address: turnData?.center?.address,
              turnStatus: turnData?.book_status,
              isDeleted: turnData?.is_deleted,
              durationConversation: turnData?.duration_conversation_doctor,
              doctorName: turnData?.doctor?.display_name,
              doctorPhone: turnData.selected_online_visit_channel?.type
                ? turnData.selected_online_visit_channel.channel
                : turnData.doctor?.online_visit_channels?.[0]?.channel,
              onlineChannel: turnData.selected_online_visit_channel?.type
                ? turnData.selected_online_visit_channel?.type
                : turnData.doctor?.online_visit_channels?.[0]?.type,
              messengerList: messengers,
              receiptLink: turnData?.share_url,
              centerId: centerId,
              patientInfo: {
                name: (() => {
                  const name = turnData?.patient?.name?.trim() || '';
                  const family = turnData?.patient?.family?.trim() || '';
                  if (!name && !family) return '';
                  if (!name) return family;
                  if (!family) return name;
                  return `${name} ${family}`;
                })(),
                cell: turnData?.patient?.cell,
                nationalCode: turnData?.patient?.national_code,
                selectServeis: turnData?.services?.[0]?.title,
              },
              selectedChannel: turnData.selected_online_visit_channel,
              ...(customize.showTermsAndConditions && {
                rules: isConsultReceipt
                  ? specialServiceInfo?.messenger
                    ? specialServiceInfo?.rules
                    : turnData.selected_online_visit_channel?.type
                    ? [
                        `لطفا <b>قبض نوبت</b> خود را در <b>${
                          messengers[turnData.selected_online_visit_channel?.type]?.text
                        }</b> برای پزشک ارسال کنید و وارد گفتگو شوید.`,
                      ]
                    : turnData?.doctor?.online_visit_channels?.[0]?.type === VisitChannels.igap
                    ? [
                        ' در <b>زمان نوبت</b> با شما <b>تماس تلفنی</b> گرفته خواهد شد.',
                        '  در صورت نیاز به ارسال مستندات درمانی (آزمایش،سونوگرافی و...) لطفا در<b>آی گپ</b> عضو شوید و با <b>ارسال قبض نوبتتان</b> به پزشک، با او وارد گفتگو شوید.',
                      ]
                    : [
                        'در زمان نوبت با شما<b> تماس تلفنی</b> برقرار خواهد شد.',
                        ' در صورت نیاز، مستندات (آزمایش، نسخه، سونوگرافی) خود را در <b>پیام رسان مورد نظر پزشک</b> ارسال نمایید.',
                      ]
                  : turnData.book_notices,
              }),
            },
            centerType: turnData.is_online_visit ? CenterType.consult : CenterType.clinic,
            metaData: { messengerButtonType, possibilityBeingVisited },
          }).map(item => (
            <div key={item.id} className="px-5 py-3">
              <BaseRow data={item as any} key={item.id} />
            </div>
          ))}
      </div>
    </div>
  );
};
export default BookInfo;
