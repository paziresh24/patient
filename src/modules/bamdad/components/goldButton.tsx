import Button, { ButtonProps } from '@/common/components/atom/button/button';
import DiamondIcon from '@/common/components/icons/diamond';
import classNames from '@/common/utils/classNames';

export const GoldButton = (props: ButtonProps) => {
  const { children, className, ...rest } = props;
  return (
    <Button
      {...rest}
      variant="secondary"
      icon={<DiamondIcon className="text-yellow-600" />}
      className={classNames('text-yellow-600 border-yellow-500 shadow-md shadow-amber-700/10 hover:bg-amber-50/50', className)}
    >
      {children}
    </Button>
  );
};

export default GoldButton;
