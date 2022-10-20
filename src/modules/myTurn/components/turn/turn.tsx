import Card from '@/components/atom/card';
import { useEffect, useState } from 'react';
import TurnBody from './body';
import TurnFooter from './footer';
import TurnHeader from './header';
import { turnDetailsData } from './turnDetails';
import type { TurnProps } from './turnType';

export const Turn: React.FC<TurnProps> = props => {
  const { status, doctorInfo, paymentStatus, turnDetails, location, feedbackUrl, prescription, centerType, patientInfo, centerInfo, id } =
    props;

  const [detailsData, setDetailsData] = useState<
    {
      id: number;
      name: string;
      value: string | undefined;
    }[]
  >([]);

  useEffect(() => {
    setDetailsData(
      turnDetailsData({
        data: turnDetails,
        centerType,
        status,
        paymentStatus,
      }),
    );
  }, [turnDetails, status, centerType]);

  return (
    <Card
      className="relative space-y-2 border-solid rounded-none md:shadow-none md:rounded-lg md:border border-slate-200"
      data-testid="turn-card"
    >
      <TurnHeader
        id={id}
        doctorInfo={doctorInfo}
        centerType={centerType}
        centerId={centerInfo.centerId}
        trackingCode={turnDetails.trackingCode}
        nationalCode={patientInfo.nationalCode}
        status={status}
      />

      <TurnBody
        id={id}
        doctorInfo={doctorInfo}
        centerId={centerInfo.centerId}
        centerType={centerType}
        detailsData={detailsData}
        location={location}
        feedbackUrl={feedbackUrl}
        status={status}
      />

      <TurnFooter
        id={id}
        centerType={centerType}
        pdfLink={prescription?.pdf}
        slug={doctorInfo.slug}
        status={status}
        hasPaging={centerInfo.hasPaging}
        bookTime={turnDetails.bookTime}
        onlineVisitChannels={doctorInfo.onlineVisitChannels}
      />
    </Card>
  );
};

export default Turn;
