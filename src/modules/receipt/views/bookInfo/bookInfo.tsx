import Skeleton from '@/common/components/atom/skeleton';
import BaseRow from '@/modules/booking/components/baseRow/baseRow';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { VisitChannels } from '../../constants/onlineVisitChannels';
import { turnDetailsData } from './turnDetails';
interface PaymentDetailsProps {
  loading: boolean;
  turnData: any;
  centerId: string;
}

export const BookInfo = (props: PaymentDetailsProps) => {
  const { loading = false, turnData, centerId } = props;
  const isConsultReceipt = centerId === '5532';
  return (
    <div className="flex flex-col space-y-6">
      <div className="mt-5 flex flex-col space-y-5 py-5 border border-solid border-slate-200  rounded-lg">
        {loading && (
          <>
            <div className="flex justify-between items-center px-5">
              <Skeleton w="10rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
            <div className="flex justify-between items-center px-5">
              <Skeleton w="6rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
            <div className="flex justify-between items-center px-5">
              <Skeleton w="8rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
            <div className="flex justify-between items-center px-5">
              <Skeleton w="12rem" h="1.1rem" rounded="full" />
              <Skeleton w="5rem" h="1.1rem" rounded="full" />
            </div>
          </>
        )}
        {!loading &&
          turnDetailsData({
            data: {
              bookTime: isConsultReceipt ? turnData.from_book : turnData.book_from,
              centerName: turnData.center_name,
              trackingCode: isConsultReceipt ? turnData.ref_id : turnData.book_ref_id,
              waitingTime: turnData?.rate_info?.waiting_time,
              centerPhone: turnData?.center_display_number,
              address: turnData?.center_address,
              turnStatus: turnData?.book_status,
              durationConversation: turnData?.duration_conversation_doctor,
              doctorPhone: turnData?.whatsapp_cell_doctor,
              receiptLink: turnData?.link_bill,
              centerId: centerId,
              patientInfo: {
                name: isConsultReceipt ? turnData.fullname_patient : `${turnData.patient_temp_name} ${turnData.patient_temp_family}`,
                cell: isConsultReceipt ? turnData.cell_patient : turnData?.patient_temp_cell,
                nationalCode: turnData?.patient_temp_national_code,
                selectServeis: turnData?.services?.[0].alias_title,
              },
              rules: isConsultReceipt
                ? turnData?.online_visit_channels?.[0].type === VisitChannels.igap
                  ? [
                      ' در <b>زمان نوبت</b> با شما <b>تماس تلفنی</b> گرفته خواهد شد.',
                      '  در صورت نیاز به ارسال مستندات درمانی (آزمایش،سونوگرافی و...) لطفا در<b>آی گپ</b> عضو شوید و با <b>ارسال قبض نوبتتان</b> به پزشک، با او وارد گفتگو شوید.',
                    ]
                  : [
                      'در زمان نوبت با شما<b> تماس تلفنی</b> برقرار خواهد شد.',
                      ' در صورت نیاز، مستندات (آزمایش، نسخه، سونوگرافی) خود را در <b>پیام رسان مورد نظر پزشک</b> ارسال نمایید.',
                    ]
                : turnData.book_notices,
            },
            centerType: isConsultReceipt ? CenterType.consult : CenterType.clinic,
          }).map(item => (
            <div key={item.id} className="px-5">
              <BaseRow data={item} key={item.id} />
            </div>
          ))}
      </div>
    </div>
  );
};
export default BookInfo;
