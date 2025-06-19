import { HTMLAttributes, ReactNode } from 'react';
import CloseIcon from '../../icons/close';
import Text from '../text';

interface ChipsProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  handleRemove?: () => void;
  icon?: ReactNode;
}

export const Chips: React.FC<ChipsProps> = props => {
  const { children, className, handleRemove, icon, ...rest } = props;
  return (
    <div
      className={`rounded-full bg-[#c8d6e240] text-[#8394a3] px-3 py-1 font-semibold inline-block whitespace-nowrap text-xs ${className}`}
      {...rest}
    >
      <div className="flex items-center justify-center space-s-1">
        {icon}
        <Text>{children}</Text>
        {handleRemove && <CloseIcon className="w-4 h-4 text-slate-500" onClick={handleRemove} />}
      </div>
    </div>
  );
};

export default Chips;
