import Skeleton from '@/common/components/atom/skeleton';
import BaseRow from '@/modules/booking/components/baseRow/baseRow';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { addCommas } from '@persian-tools/persian-tools';
import { turnDetailsData } from './turnDetails';

interface PaymentDetailsProps {
  loading: boolean;
  turnData: any;
}

export const BookInfo = (props: PaymentDetailsProps) => {
  const { loading = false, turnData } = props;
  const formattedPrice = addCommas(+0 / 10);
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
              bookTime: turnData.book_from,
              centerName: turnData.center_name,
              trackingCode: turnData.book_ref_id,
              waitingTime: turnData?.rate_info?.waiting_time ?? '6 ساعت',
              centerPhone: turnData?.center_display_number,
              address: turnData?.center_address,
              centerId: turnData?.center_id,
              patientInfo: {
                name: `${turnData.patient_temp_name} ${turnData.patient_temp_family}`,
                cell: turnData?.patient_temp_cell,
                nationalCode: turnData?.patient_temp_national_code,
                selectServeis: turnData?.services[0].alias_title,
              },
              rules: [
                'لطفا پس از مراجعه به مطب(مرکز درمانی) ، به منشی اعلام کنید از طریق پذیرش24 نوبت را دریافت کرده اید تا پذیرش شما تکمیل شده و طبق زمان انتظار به پزشک مراجعه کنید.',
                'با توجه به عمل های اورژانسی پزشک و یا سایر مراجعات درمانی غیر منتظره به پزشک ممکن است زمان انتظار ویزیت شما متفاوت باشد.',
                'شما می‌توانید با نصب اپلیکیشن پذیرش24، روند درمان خود را تکمیل کنید و از تغییر زمان نوبت توسط پزشک مطلع شوید.',
              ],
            },
            centerType: CenterType.clinic,
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
