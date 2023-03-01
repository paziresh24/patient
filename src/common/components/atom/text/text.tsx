import classNames from '@/common/utils/classNames';

type Text0wnProps<E extends React.ElementType> = {
  children?: React.ReactNode;
  className?: string;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  fontWeight?: 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';
  align?: 'center' | 'left' | 'right' | 'justify' | 'start' | 'end';
  as?: E;
};

type TextProps<E extends React.ElementType> = Text0wnProps<E> & Omit<React.ComponentProps<E>, keyof Text0wnProps<E>>;

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
  align: {
    center: 'text-center',
    start: 'text-start',
    end: 'text-end',
    left: 'text-left',
    right: 'text-right',
    justify: 'text-justify',
  },
};

export const Text = <E extends React.ElementType = 'span'>({
  align,
  children,
  as,
  className,
  fontSize,
  fontWeight,
  ...rest
}: TextProps<E>) => {
  const Component = as || 'span';
  return (
    <Component
      className={classNames(className, {
        [textStyles.size[fontSize!]]: fontSize,
        [textStyles.weight[fontWeight!]]: fontWeight,
        [textStyles.align[align!]]: align,
      })}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text;
