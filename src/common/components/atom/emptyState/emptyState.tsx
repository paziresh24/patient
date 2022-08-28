import EmptyStateIcon from './emptyStateIcon';

interface EmptyStateProps {
  text: string;
}

export const EmptyState = ({ text }: EmptyStateProps) => {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 bg-white flex justify-center items-center flex-col space-y-4">
      <EmptyStateIcon />
      <span className="text-zinc-400 text-sm font-medium">{text}</span>
    </div>
  );
};

export default EmptyState;
