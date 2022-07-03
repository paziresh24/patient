import type { TurnProps } from "./turnType";
import Card from "../../atoms/card";
import { useState, useEffect } from "react";

import { TurnBody, TurnFooter, TurnHeader } from "../../molecules/turnCard";
import { turnDetailsData } from "./turnDetails";

export const Turn: React.FC<TurnProps> = (props) => {
  const {
    status,
    doctorInfo,
    turnDetails,
    location,
    feedbackUrl,
    prescription,
    centerType,
    patientInfo,
    centerInfo,
    id,
  } = props;

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
      })
    );
  }, [turnDetails, status, centerType]);

  return (
    <Card className="space-y-2 relative" data-testid="turn-card">
      <TurnHeader
        id={id}
        doctorInfo={doctorInfo}
        centerId={centerInfo.centerId}
        trackingCode={turnDetails.trackingCode}
        nationalCode={patientInfo.nationalCode}
        status={status}
      />

      <TurnBody
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
      />
    </Card>
  );
};

export default Turn;
