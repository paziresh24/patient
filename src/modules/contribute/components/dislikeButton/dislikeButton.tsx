import DislikeIcon from '@/common/components/icons/dislike';
import classNames from '@/common/utils/classNames';
interface Props {
  fill: boolean;
  onClick: () => void;
}
export const DislikeButton = ({ fill, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <DislikeIcon
        className={classNames({
          'text-red-500': fill,
        })}
      />
    </button>
  );
};

export default DislikeButton;
