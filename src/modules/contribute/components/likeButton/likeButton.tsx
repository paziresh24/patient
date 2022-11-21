import LikeIcon from '@/common/components/icons/like';
import clsx from 'clsx';

interface Props {
  fill: boolean;
  onClick: () => void;
}

export const LikeButton = ({ fill, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <LikeIcon
        className={clsx({
          'text-green-500': fill,
        })}
      />
    </button>
  );
};

export default LikeButton;
