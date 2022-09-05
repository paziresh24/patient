import TrashIcon from '@/common/components/icons/trash';

export const RemoveButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className="p-2 rounded-md border border-solid border-slate-300">
      <TrashIcon className="text-slate-600" />
    </button>
  );
};

export default RemoveButton;
