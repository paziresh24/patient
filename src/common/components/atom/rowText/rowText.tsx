import clsx from 'clsx';
import Text from '../text/text';

interface RowTextProps {
  title: string;
  value: string | any;
  className?: string;
  titleFontWeight: 'bold' | 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'extraBold' | 'black';
  titleFontSize: 'base' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  valueFontWeight: 'bold' | 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'extraBold' | 'black';
  valueFontSize: 'base' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
}

export const RowText = (props: RowTextProps) => {
  const { title, value, className, titleFontWeight, titleFontSize, valueFontWeight, valueFontSize } = props;

  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <Text fontWeight={titleFontWeight} fontSize={titleFontSize}>
        {title}
      </Text>
      <Text fontWeight={valueFontWeight} fontSize={valueFontSize}>
        {value}
      </Text>
    </div>
  );
};

export default RowText;
