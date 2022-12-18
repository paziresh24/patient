import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { addCommas } from '@persian-tools/persian-tools';
import dynamic from 'next/dynamic';
import { turnDetailsData } from './turnDetails';
const PdfGenerator = dynamic(() => import('@/common/components/atom/pdfGenerator/pdfGenerator'), { ssr: false });

interface PaymentDetailsProps {
  loading: boolean;
  turnData: any;
}
export const BookInfo = (props: PaymentDetailsProps) => {
  const { loading = false, turnData } = props;
  const formattedPrice = addCommas(+0 / 10);
  return (
    <PdfGenerator pdfName="Recipt">
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
                patientName: `${turnData.patient_temp_name} ${turnData.patient_temp_family}`,
                trackingCode: turnData.book_ref_id,
                waitingTime: turnData?.rate_info?.waiting_time ?? '',
              },
              centerType: CenterType.clinic,
            }).map(item => (
              <div key={item.id} className="flex items-center justify-between px-5">
                <Text fontWeight="medium" fontSize="sm">
                  {item.name}
                </Text>
                <Text fontWeight="medium" fontSize="sm">
                  {item.value}
                </Text>
              </div>
            ))}
        </div>
      </div>
    </PdfGenerator>
  );
};
export default BookInfo;
