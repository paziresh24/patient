import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import Loading from '../loading';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
        The content of the button.
    */
  children: React.ReactNode;
  /**
        The variant of the button.
        values: primary, secondary
        @default primary
    */
  variant?: 'primary' | 'secondary' | 'text';
  /**
   * The size of the button.
   * values: sm, md, lg
   * @default medium
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The theme of the button.
   * values: simple, error
   * @default simple
   */
  theme?: 'simple' | 'error';
  /**
   * the icon before the text
   */
  icon?: React.ReactNode;
  /**
   * The when button full width
   * @default false
   */
  block?: boolean;
  className?: string;
  /**
   * The loading state of the button
   * @default false
   */
  loading?: boolean;
  disabled?: boolean;
}

const buttonStyles = {
  variant: {
    primary: 'bg-primary border border-primary text-white disabled:bg-slate-200 disabled:border-slate-200 disabled:text-slate-500',
    secondary: 'border border-primary/40 text-primary disabled:border-slate-300 disabled:text-slate-400 hover:bg-primary/5',
    text: 'text-primary disabled:text-slate-400 bg-transparent hover:bg-primary/5',
  },
  loading: {
    primary: 'fill-slate-500',
    secondary: 'fill-slate-400',
    text: 'fill-slate-500',
  },
  size: {
    sm: 'px-3 h-10 text-sm',
    md: 'px-4 h-12 text-sm',
    lg: 'px-5 h-14 text-md',
  },
  theme: {
    error: {
      primary: 'bg-red-500 border-red-50 !text-white',
      secondary: 'border-red-500 !text-red-500 hover:bg-red-50',
      text: '!text-red-500 hover:bg-red-50',
    },
    simple: {
      primary: '',
      secondary: '',
      text: '',
    },
  },
  block: 'w-full',
};

export const Button: React.FC<ButtonProps> = props => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    theme = 'simple',
    block = false,
    onClick,
    icon,
    className,
    loading = false,
    disabled = false,
    ...rest
  } = props;

  return (
    <button
      className={clsx(
        'flex items-center justify-center rounded-lg font-bold gap-1 transition-all',
        buttonStyles.variant[variant],
        buttonStyles.size[size],
        buttonStyles.theme[theme][variant],
        { [buttonStyles['block']]: block, [buttonStyles['loading'][variant]]: loading },
        className,
      )}
      onClick={onClick}
      disabled={loading || disabled}
      {...rest}
    >
      {!loading && (
        <>
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          {children}
        </>
      )}
      {loading && <Loading className="fill-inherit" />}
    </button>
  );
};

export default Button;
