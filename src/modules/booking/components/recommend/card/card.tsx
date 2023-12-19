import Text from '@/common/components/atom/text';
import Card from '@/modules/search/components/card';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import ScrollContainer from 'react-indiana-drag-scroll';

type Recommends = {
  image?: string;
  displayAddress?: string;
  displayExpertise?: string;
  displayName: string;
  freeturn?: string;
  isBulk: boolean;
  isOnline?: boolean;
  ratesCount: number;
  rate: number;
  url: string;
  id: string;
  action?: any;
  badges?: any;
  price?: string;
};

type ShowMore = {
  url: string;
  text: string;
  classname?: string;
  icon?: React.ReactNode;
};

interface RecommendCardProps {
  listOfDoctors: Recommends[];
  showMore?: ShowMore;
  clickRecommendEvent?: (id: string, elementName?: string, elementContent?: string) => void;
}

export const RecommendCard = (props: RecommendCardProps) => {
  const { listOfDoctors, clickRecommendEvent, showMore } = props;
  const router = useRouter();

  return (
    <>
      <ScrollContainer className="flex w-full pl-5 !overflow-auto rounded-lg select-none no-scroll space-s-2 no-scroll">
        {listOfDoctors?.map(doctor => (
          <Card
            key={doctor.id}
            className="w-[15rem] min-w-[15rem] !space-y-0"
            type="doctor"
            baseInfo={{
              displayName: doctor.displayName,
              avatar: doctor.image,
              url: doctor.url,
              expertise: doctor.displayExpertise,
              isVerify: !doctor.isBulk,
              rate: {
                count: doctor.ratesCount,
                satisfaction: doctor.rate,
              },
              isOnline: doctor.isOnline,
            }}
            details={{
              ...(doctor.displayAddress && { address: { text: doctor.displayAddress } }),
              badges: doctor.badges,
              price: doctor.price,
            }}
            actions={doctor?.action?.map((item: any) => ({
              text: item.title,
              description: item.description,
              outline: item.outline,
              action: () => {
                router.push(doctor.url);
              },
            }))}
            sendEventWhenClick={({ element, content }) => clickRecommendEvent?.(doctor.id, element, content)}
          />
        ))}
        {!!showMore && (
          <div
            className={clsx('w-[15rem] min-w-[15rem] !space-y-0 bg-primary rounded-md cursor-pointer', showMore.classname)}
            onClick={() => router.push(showMore.url)}
          >
            <Text>{showMore.text}</Text>
            {showMore?.icon ?? ''}
          </div>
        )}
      </ScrollContainer>
    </>
  );
};

export default RecommendCard;
