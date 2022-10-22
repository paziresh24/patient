import DislikeIcone from '@/common/components/icons/dislike';
interface Props {
  color?: string;
  onClick?: () => void;
}
export const DislikeButton = ({ color, onClick }: Props) => {
  return (
    <button onClick={onClick} className="p-[0.3rem] rounded-md border border-solid border-slate-300">
      <DislikeIcone color={color} />
    </button>
  );
};

export default DislikeButton;
