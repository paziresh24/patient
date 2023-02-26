import RateBadge from '@/common/components/atom/badge';
import Text from '@/common/components/atom/text/text';
import LikeIcon from '@/common/components/icons/like';
import ProgressBar from '../../../../common/components/atom/progressBar/progressBar';
import { DetailsProps } from '../../type/rate';

export const Details = (props: DetailsProps) => {
  const { satisfaction, title, count, count_text, information } = props;
  return (
    <>
      {satisfaction && (
        <RateBadge
          text={`${satisfaction}%`}
          icon={<LikeIcon className="w-5 text-white" />}
          parentClassName="!bg-green-600"
          className="mt-1"
          fontSize="sm"
          caption={`${title} (${count} ${count_text ?? ''})`}
        />
      )}
      <div className="flex flex-col gap-3">
        {information.map(info => (
          <ProgressBar key={info.id} title={info.title} Percent={info.satisfaction} score={info.avg_star} />
        ))}
      </div>
    </>
  );
};

export default Details;
