import LikeIcon from '@/common/components/icons/like';

interface Props {
  currentColor?: string;
  onClick?: () => void;
}

export const LikeButton = ({ currentColor, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <LikeIcon currentColor={currentColor} />
    </button>
  );
};

export default LikeButton;
