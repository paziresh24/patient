import TurnDetails from "../../turnDetails";
import Location from "../../location/location";
import Rate from "../../rate/rate";
import { BookStatus } from "@/types/bookStatus";
import { CenterType } from "@/types/centerType";

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
}

export const TurnBody: React.FC<TurnBodyProps> = (props) => {
  const { detailsData, status, feedbackUrl, location, centerType } = props;

  const shouldShowLocation =
    centerType !== CenterType.consult &&
    status !== BookStatus.expired &&
    status !== BookStatus.visited &&
    status !== BookStatus.deleted &&
    status !== BookStatus.rejected;
  const shouldShowRate =
    centerType !== CenterType.consult &&
    (status === BookStatus.expired || status === BookStatus.visited) &&
    feedbackUrl;

  return (
    <>
      <TurnDetails items={detailsData} />

      {shouldShowLocation && (
        <Location address={location.address} lat={location.lat} lng={location.lng} />
      )}
      {shouldShowRate && <Rate link={feedbackUrl} />}
    </>
  );
};

export default TurnBody;
