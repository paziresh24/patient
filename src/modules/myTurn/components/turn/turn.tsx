import Card from '@/components/atom/card';
import { useEffect, useState } from 'react';
import TurnBody from './body';
import TurnFooter from './footer';
import TurnHeader from './header';
import { turnDetailsData } from './turnDetails';
import type { TurnProps } from './turnType';

export const Turn: React.FC<TurnProps> = props => {
  const { status, doctorInfo, turnDetails, location, feedbackUrl, prescription, centerType, patientInfo, centerInfo, id } = props;

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
      }),
    );
  }, [turnDetails, status, centerType]);

  return (
    <Card
      className="space-y-2 md:shadow-none rounded-none md:rounded-lg md:border border-solid border-slate-200 relative"
      data-testid="turn-card"
    >
      <TurnHeader
        id={id}
        doctorInfo={doctorInfo}
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
        whatsapp={doctorInfo.whatsapp}
        centerId={centerInfo.centerId}
        userCenterId={centerInfo.userCenterId}
        serverId={centerInfo.serverId}
        // serviceId=
      />
    </Card>
  );
};

export default Turn;
