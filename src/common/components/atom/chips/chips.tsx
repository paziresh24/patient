import Text from '../text';

interface ChipsProps {
  children: React.ReactNode;
  className?: string;
}

export const Chips: React.FC<ChipsProps> = props => {
  const { children, className, ...rest } = props;
  return (
    <div
      className={`rounded-full bg-[#c8d6e240] text-[#8394a3] px-3 py-1 font-semibold inline-block whitespace-nowrap text-xs ${className}`}
      {...rest}
    >
      <Text>{children}</Text>
    </div>
  );
};

export default Chips;
