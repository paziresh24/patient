import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import Text from '../text';

type CheckBoxProps = Omit<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'>;

export interface InputProps extends CheckBoxProps {
  label?: string;
  labelName?: string;
  classNameWrapper?: string;
}

// eslint-disable-next-line react/display-name
export const CheckBox = forwardRef((props: InputProps, ref: ForwardedRef<any>) => {
  const { label, labelName, className, classNameWrapper, ...CheckBoxProps } = props;

  return (
    <label htmlFor={labelName} className={classNameWrapper}>
      <input type="checkbox" value="" ref={ref} className="w-4 h-4" {...CheckBoxProps} />
      <Text fontSize="sm" fontWeight="medium" className="mr-2">
        {label}
      </Text>
    </label>
  );
});

export default CheckBox;
