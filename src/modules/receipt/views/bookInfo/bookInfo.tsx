import { useChatLifecycleAutoCloseHours } from '@/common/apis/services/hami/chatLifecycleSettings';
import Skeleton from '@/common/components/atom/skeleton';
import useCustomize from '@/common/hooks/useCustomize';
import BaseRow from '@/modules/booking/components/baseRow/baseRow';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { VisitChannels } from '../../constants/onlineVisitChannels';
import { turnDetailsData } from './turnDetails';

interface PaymentDetailsProps {
  loading: boolean;
  turnData: any;
  centerId: string;
  bookId?: string;
  possibilityBeingVisited?: boolean;
  /** Doctor user_id resolved on receipt via doctor slug → drprofile (or appointment doctor). */
  doctorUserId?: string | number | null;
  /**
   * True while receipt is still resolving the canonical doctor slug.
   * Hides legacy "days" so targeted doctors don't flash "تا ۳ روز" before GB turns on.
   */
  doctorProfilePending?: boolean;
}

export const BookInfo = (props: PaymentDetailsProps) => {
  const { loading = false, turnData, centerId, bookId, possibilityBeingVisited, doctorUserId, doctorProfilePending } = props;
  const specialDoctorList = useFeatureValue<any[]>('rocketchat_doctor_list', []);
  const specialServiceInfo = specialDoctorList.find((service: any) => service.service_id === turnData?.services?.[0]?.id);
  const messengers = useFeatureValue<any>('onlinevisitchanneltype', {});
  const messengerButtonType = useFeatureValue('receipt:messenger-button-type', 'OUTLINE');
  const isConsultReceipt = centerId === '5532';
  const { customize } = useCustomize();
  const useChatLifecycleDuration = useFeatureIsOn('online-visit-chat-lifecycle-duration');
  // Prefer page-resolved doctor user_id; else bookId → appointment doctor; else slug (may be non-canonical).
  const { days: chatLifecycleDays, isPending: isChatLifecycleDurationPending } = useChatLifecycleAutoCloseHours({
    enabled: useChatLifecycleDuration && isConsultReceipt,
    doctorUserId,
    bookId,
    doctorSlug: turnData?.doctor?.slug,
  });
  const shouldShowLifecycleDays = useChatLifecycleDuration && chatLifecycleDays != null;
  // While canonical slug is resolving, feature may still be off (wrong short slug) — don't flash legacy days.
  const hideLegacyDurationWhileResolving = isConsultReceipt && !!doctorProfilePending && !useChatLifecycleDuration;

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
              // Feature on: never show legacy "days". Loading → skeleton; ready → API days (from hours ÷ 24) or 1-day fallback.
              // While resolving canonical slug, hide legacy days so GB targeting can catch up.
              durationConversation: shouldShowLifecycleDays
                ? String(chatLifecycleDays)
                : useChatLifecycleDuration || hideLegacyDurationWhileResolving
                  ? undefined
                  : turnData?.duration_conversation_doctor,
              durationConversationUnit: 'days',
              durationConversationLoading: isChatLifecycleDurationPending || hideLegacyDurationWhileResolving,
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
              bookId: bookId ?? turnData?.book_id,
              patientInfo: {
                name: `${turnData?.patient?.name} ${turnData?.patient?.family}`,
                cell: turnData?.patient?.cell,
                nationalCode: turnData?.patient?.national_code,
                selectServeis: turnData?.services?.[0]?.title,
              },
              service: turnData?.services?.[0],
              channels: turnData?.doctor?.online_visit_channels,
              selectedChannel: turnData.selected_online_visit_channel,
              ...(customize.showTermsAndConditions && {
                rules: isConsultReceipt
                  ? specialServiceInfo?.messenger
                    ? specialServiceInfo?.rules
                    : turnData.selected_online_visit_channel?.type
                      ? [
                        `لطفا <b>قبض نوبت</b> خود را در <b>${messengers[turnData.selected_online_visit_channel?.type]?.text
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
