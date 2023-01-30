import Text from '@/common/components/atom/text/text';
import LikeIcon from '@/common/components/icons/like';
import ProgressBar from '../../../../common/components/atom/progressBar/progressBar';
import { information } from '../../type/detailsInformation';

interface DetailsProps {
  satisfaction?: number;
  title?: string;
  count?: number;
  count_text?: string;
  information: information[];
}

export const Details = (props: DetailsProps) => {
  const { satisfaction, title, count, count_text, information } = props;
  return (
    <>
      <div className="flex gap-3 items-center justify-center mb-5">
        {satisfaction && (
          <div className="flex items-center justify-center gap-1 bg-green-500 text-white pt-1 pb-2 px-3 rounded-3xl">
            <LikeIcon className="w-5 text-white" />
            <Text className="mt-2">{satisfaction}%</Text>
          </div>
        )}
        {title && <Text fontWeight="medium">{title}</Text>}
        {count && <Text fontWeight="medium">{`(${count} ${count_text ?? ''})`}</Text>}
      </div>
      <div className="flex flex-col gap-3">
        {information.map(info => (
          <ProgressBar key={info.id} title={info.title} Percent={info.satisfaction} score={info.avg_star} />
        ))}
      </div>
    </>
  );
};

export default Details;
