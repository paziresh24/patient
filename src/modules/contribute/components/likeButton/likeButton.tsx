import LikeIcon from '@/common/components/icons/like';
import classNames from '@/common/utils/classNames';

interface Props {
  fill: boolean;
  onClick: () => void;
}

export const LikeButton = ({ fill, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <LikeIcon
        className={classNames({
          'text-green-500': fill,
        })}
      />
    </button>
  );
};

export default LikeButton;
