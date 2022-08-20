import TurnDetails from "../../turnDetails";
import Location from "../../location/location";
import Rate from "../../rate/rate";
import { BookStatus } from "@/types/bookStatus";
import { CenterType } from "@/types/centerType";
import { redirectToReceoptTurn } from "@/functions/redirectToReceoptTurn";

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
}

export const TurnBody: React.FC<TurnBodyProps> = (props) => {
  const { detailsData, status, feedbackUrl, location, centerType, id, centerId, doctorInfo } =
    props;

  const shouldShowLocation = centerType !== CenterType.consult;
  const shouldShowRate =
    centerType !== CenterType.consult &&
    (status === BookStatus.expired || status === BookStatus.visited) &&
    feedbackUrl;

  const handleClinkCard = () => {
    redirectToReceoptTurn({
      slug: doctorInfo.slug,
      bookId: id,
      centerId: centerId,
    });
  };

  return (
    <>
      <TurnDetails items={detailsData} onClick={handleClinkCard} />

      {shouldShowLocation && (
        <Location address={location.address} lat={location.lat} lng={location.lng} />
      )}
      {shouldShowRate && <Rate link={feedbackUrl} />}
    </>
  );
};

export default TurnBody;
