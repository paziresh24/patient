import Button from "@/components/atoms/button";
import Card from "@/components/atoms/card";
import Chips from "@/components/atoms/chips";
import Text from "@/components/atoms/text";
import TurnDetails from "@/components/molecules/turnDetails";
import convertTimeStampToFormattedTime from "@/utils/convertTimeStampToFormattedTime";
import convertTimeStampToPersianDate from "@/utils/convertTimeStampToPersianDate";
import { toast } from "react-toastify";

interface PrescriptionProps {
  fullName: string;
  finalizedAt: string;
  pdfName: string;
}

const Prescription = (props: PrescriptionProps) => {
  const { fullName, finalizedAt, pdfName } = props;

  const finalizedAtTimeStamp = new Date(finalizedAt).getTime() / 1000;

  const detailsData = [
    {
      id: 0,
      name: "تاریخ تجویز",
      value: `${convertTimeStampToFormattedTime(
        finalizedAtTimeStamp
      )} - ${convertTimeStampToPersianDate(finalizedAtTimeStamp)}`,
    },
  ];

  const showPrescription = () => {
    if (!pdfName) return toast.info("PDF نسخه یافت نشد.");
    window.open(`${process.env.NEXT_PUBLIC_PRESCRIPTION_API}/pdfs/${pdfName}`);
  };

  return (
    <Card className="space-y-4 relative" data-testid="turn-card">
      <Text
        fontSize="sm"
        fontWeight="bold"
        className="line-clamp-1"
        data-testid="doctor-info__full-name"
      >
        {fullName}
      </Text>
      <Chips className="absolute left-4 -top-1">نسخه</Chips>
      <TurnDetails items={detailsData} />
      <Button variant="secondary" size="sm" block onClick={showPrescription}>
        مشاهده نسخه
      </Button>
    </Card>
  );
};

export default Prescription;
