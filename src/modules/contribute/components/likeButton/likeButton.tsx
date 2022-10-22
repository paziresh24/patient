import LikeIcon from '@/common/components/icons/like';

interface Props {
  color?: string;
  onClick?: () => void;
}

export const LikeButton = ({ color, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <LikeIcon color={color} />
    </button>
  );
};

export default LikeButton;
