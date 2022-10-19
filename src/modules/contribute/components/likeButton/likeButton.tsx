import LikeIcon from '@/common/components/icons/like';

export const LikeButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <LikeIcon />
    </button>
  );
};

export default LikeButton;
