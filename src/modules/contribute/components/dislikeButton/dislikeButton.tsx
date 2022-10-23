import DislikeIcon from '@/common/components/icons/dislike';
import clsx from 'clsx';
interface Props {
  fill: boolean;
  onClick: () => void;
}
export const DislikeButton = ({ fill, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <DislikeIcon
        className={clsx({
          'text-red-500': fill,
        })}
      />
    </button>
  );
};

export default DislikeButton;
