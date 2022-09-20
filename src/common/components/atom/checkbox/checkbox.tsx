import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import Text from '../text';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelName?: string;
}

// eslint-disable-next-line react/display-name
export const CheckBox = forwardRef((props: InputProps, ref: ForwardedRef<any>) => {
  const { label, labelName, className, ...CheckBoxProps } = props;

  return (
    <label className={className}>
      <input type="checkbox" ref={ref} className="w-4 h-4" {...CheckBoxProps} />
      <Text fontSize="sm" fontWeight="medium" className="mr-2">
        {label}
      </Text>
    </label>
  );
});

export default CheckBox;
