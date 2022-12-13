import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
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
      <div className="mt-5 flex flex-col space-y-5 py-5 border border-solid border-slate-200 bg-[#f8fafb] rounded-lg">
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
              patientName: `${turnData.patient_temp_name} ${turnData.patient_temp_family}`,
              trackingCode: turnData.book_ref_id,
              waitingTime: 'کمتر از یک ساعت' ?? '',
              address: turnData.center_address,
              centerId: turnData.center_id,
              centerPhone: turnData.center_tell,
            },
            centerType: CenterType.clinic,
          }).map(item => (
            <>
              <div key={item.id} className="flex items-center justify-between px-5">
                <Text fontWeight="medium" fontSize="sm">
                  {item.name}
                </Text>
                {item.type === 'String' && (
                  <Text fontWeight="medium" fontSize="sm">
                    {item.value}
                  </Text>
                )}
                {item.type === 'Button' && (
                  <Button variant="secondary" onClick={item.buttonAction}>
                    {item.value}
                  </Button>
                )}
              </div>
              {item.id === 1 && (
                <Text fontSize="sm" fontWeight="normal" className="flex px-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                    <path
                      d="M12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7H12.75ZM11.25 14C11.25 14.4142 11.5858 14.75 12 14.75C12.4142 14.75 12.75 14.4142 12.75 14H11.25ZM12.75 16.99C12.75 16.5758 12.4142 16.24 12 16.24C11.5858 16.24 11.25 16.5758 11.25 16.99H12.75ZM11.25 17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17H11.25ZM11.25 7V14H12.75V7H11.25ZM11.25 16.99V17H12.75V16.99H11.25ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75V2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75Z"
                      fill="#f9c74f"
                    />
                  </svg>
                  زمان نوبت اعلام شده، برای حضور در مرکز درمانی بوده و با زمان ویزیت تفاوت دارد.
                </Text>
              )}
            </>
          ))}
      </div>
    </div>
  );
};
export default BookInfo;
