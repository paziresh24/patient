import clsx from 'clsx';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  fontWeight?: 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';
}

const textStyles = {
  size: {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl',
  },
  weight: {
    thin: 'font-thin',
    extraLight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semiBold: 'font-semibold',
    bold: 'font-bold',
    extraBold: 'font-extrabold',
    black: 'font-black',
  },
};

export const Text: React.FC<TextProps> = props => {
  const { fontSize, fontWeight, className, children, ...rest } = props;
  return (
    <span
      className={clsx(className, {
        [textStyles.size[fontSize!]]: fontSize,
        [textStyles.weight[fontWeight!]]: fontWeight,
      })}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Text;
