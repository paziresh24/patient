import DislikeIcone from '@/common/components/icons/dislike';
interface Props {
  currentColor?: string;
  onClick?: () => void;
}
export const DislikeButton = ({ currentColor, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <DislikeIcone currentColor={currentColor} />
    </button>
  );
};

export default DislikeButton;
