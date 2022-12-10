import Card from '@/modules/search/components/card';

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
};

interface RecommendCardProps {
  recommendDoctors: Recommends[];
}

export const RecommendCard = (props: RecommendCardProps) => {
  const { recommendDoctors } = props;
  return (
    <>
      <div>
        {recommendDoctors.length &&
          recommendDoctors.map(doctor => (
            <>
              <Card
                type="doctor"
                baseInfo={{
                  displayName: doctor.displayName,
                  avatar: doctor.image,
                  url: doctor.url,
                  expertise: doctor.displayExpertise,
                  experience: doctor.experience,
                  rate: {
                    count: doctor.ratesCount,
                    satisfaction: doctor.rate,
                  },
                }}
              />
            </>
          ))}
      </div>
    </>
  );
};

export default RecommendCard;
