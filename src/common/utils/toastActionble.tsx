import { toast } from 'react-hot-toast';
import Button from '../components/atom/button';

export const toastActionble = (options: {
  message: string;
  action?: {
    label: string;
    link: string;
  };
}) => {
  const { message, action } = options;
  return (t: any) => (
    <div className="flex flex-col w-full">
      <span
        style={{
          display: 'flex',
          margin: '4px 10px',
          color: 'inherit',
          flex: '1 1 auto',
          whiteSpace: 'pre-line',
        }}
      >
        {message}
      </span>
      {action && (
        <Button
          onClick={() => {
            location.href = action.link;
            toast.dismiss(t.id);
          }}
          size="sm"
          variant="secondary"
          className="min-w-28 mt-2 font-semibold text-sm"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
