import DislikeIcone from '@/common/components/icons/dislike';

export const DislikeButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <DislikeIcone />
    </button>
  );
};

export default DislikeButton;
