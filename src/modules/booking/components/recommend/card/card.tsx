import Card from '@/modules/search/components/card';
import { useRouter } from 'next/router';
import ScrollContainer from 'react-indiana-drag-scroll';

type Recommends = {
  image?: string;
  displayAddress?: string;
  displayExpertise?: string;
  displayName: string;
  medicalCode?: string;
  experience?: number;
  freeturn?: string;
  isBulk: true;
  ratesCount: number;
  rate: number;
  url: string;
  id: string;
  action?: any;
};

interface RecommendCardProps {
  listOfDoctors: Recommends[];
}

export const RecommendCard = (props: RecommendCardProps) => {
  const { listOfDoctors } = props;
  const router = useRouter();
  return (
    <>
      <ScrollContainer className="flex w-full px-5 pb-5 select-none no-scroll space-s-3">
        {listOfDoctors?.map(doctor => (
          <Card
            key={doctor.id}
            className="w-[22rem] min-w-[22rem]"
            type="doctor"
            baseInfo={{
              displayName: doctor.displayName,
              avatar: doctor.image,
              url: doctor.url,
              expertise: doctor.displayExpertise,
              experience: doctor.experience,
              isVerify: !doctor.isBulk,
              rate: {
                count: doctor.ratesCount,
                satisfaction: doctor.rate,
              },
            }}
            details={{
              address: { text: doctor.displayAddress ?? '' },
            }}
            actions={doctor?.action?.map((item: any) => ({
              text: item.title,
              description: item.description,
              action: () => {
                router.push(doctor.url);
              },
            }))}
          />
        ))}
      </ScrollContainer>
    </>
  );
};

export default RecommendCard;
