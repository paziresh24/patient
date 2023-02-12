import RateBadge from '@/common/components/atom/badge';
import Text from '@/common/components/atom/text/text';
import LikeIcon from '@/common/components/icons/like';
import ProgressBar from '../../../../common/components/atom/progressBar/progressBar';
import { DetailsProps } from '../../type/rate';

export const Details = (props: DetailsProps) => {
  const { satisfaction, title, count, count_text, information } = props;
  return (
    <>
      <div className="flex gap-3 items-center justify-center mb-5">
        {satisfaction && (
          <RateBadge
            text={`${satisfaction}%`}
            icon={<LikeIcon className="w-5 text-white" />}
            parentClassName="!bg-green-500"
            className="mt-1"
          />
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
