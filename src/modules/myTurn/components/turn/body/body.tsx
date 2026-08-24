import useCustomize from '@/common/hooks/useCustomize';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import { shouldShowAppointmentReviewCta } from '@/modules/myTurn/utils/shouldShowAppointmentReviewCta';
import { useRouter } from 'next/router';
import Location from '../../location/location';
import Rate from '../../rate/rate';
import TurnDetails from '../../turnDetails';

interface TurnBodyProps {
  detailsData: Array<{ id: number; name: string; value: string | React.ReactNode }>;
  status: BookStatus;
  feedbackUrl: string | null;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  centerType: CenterType;
  id: string;
  doctorInfo: {
    slug: string;
  };
  centerId: string;
  paymentStatus: PaymentStatus;
  isFromDashboard?: boolean;
  isDelete?: boolean;
  hasReviewed?: boolean;
  bookTimestamp?: number;
  currentTime?: number;
}

export const TurnBody: React.FC<TurnBodyProps> = props => {
  const {
    detailsData,
    status,
    feedbackUrl,
    location,
    centerType,
    id,
    centerId,
    doctorInfo,
    paymentStatus,
    isFromDashboard,
    isDelete,
    hasReviewed,
    bookTimestamp,
    currentTime,
  } = props;
  const router = useRouter();
  const { customize } = useCustomize();

  const shouldShowLocation = centerType !== CenterType.consult;
  const shouldShowRate =
    Boolean(feedbackUrl) &&
    shouldShowAppointmentReviewCta({
      isDelete: Boolean(isDelete),
      status,
      paymentStatus,
      bookTimestamp,
      currentTime,
    });

  const handleClickCard = () => {
    if (paymentStatus !== PaymentStatus.paying) {
      router.push(`/receipt/${centerId}/${id}?slug=${doctorInfo.slug}`);
      return;
    }
  };

  return (
    <>
      <TurnDetails items={detailsData} onClick={handleClickCard} />

      {shouldShowLocation && <Location address={location.address} lat={location.lat} lng={location.lng} />}
      {shouldShowRate && customize.showRateAndReviews && (
        <Rate
          link={feedbackUrl ?? ''}
          bookId={id}
          centerId={centerId}
          doctorSlug={doctorInfo.slug}
          isFromDashboard={isFromDashboard}
          hasReviewed={hasReviewed}
        />
      )}
    </>
  );
};

export default TurnBody;
