import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import clsx from 'clsx';

interface RowButtonProps {
  title: string;
  value: string | any;
  buttonAction?: () => void;
  className?: string;
  titleFontWeight: 'bold' | 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'extraBold' | 'black';
  titleFontSize: 'base' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  variant: 'text' | 'secondary' | 'primary';
}

export const RowButton = (props: RowButtonProps) => {
  const { title, value, className, titleFontWeight, titleFontSize, buttonAction, variant } = props;

  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <Text fontWeight={titleFontWeight} fontSize={titleFontSize}>
        {title}
      </Text>
      <Button variant={variant} onClick={buttonAction}>
        {value}
      </Button>
    </div>
  );
};

export default RowButton;
