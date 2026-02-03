import classNames from '@/common/utils/classNames';
import { ForwardedRef, forwardRef, InputHTMLAttributes, useEffect, useId, useState } from 'react';

export type SwitchProps = InputHTMLAttributes<HTMLInputElement>;

export const Switch = forwardRef((props: SwitchProps, ref: ForwardedRef<any>) => {
  const { className, onChange, ...checkBoxProps } = props;
  const [isChecked, setIsChecked] = useState(checkBoxProps.defaultChecked);
  const uniqueId = useId();

  useEffect(() => {
    setIsChecked(props.checked);
  }, [props.checked]);

  return (
    <div>
      <input
        onChange={e => {
          setIsChecked(e.target.checked);
          onChange && onChange(e);
        }}
        type="checkbox"
        ref={ref}
        className="absolute invisible"
        {...checkBoxProps}
        id={uniqueId}
      ></input>
      <label
        htmlFor={uniqueId}
        onClick={() => setIsChecked(prev => !prev)}
        className={classNames(
          'w-[40px] h-[25px] flex items-center justify-end bg-slate-200 rounded-full p-[4px] duration-300 ease-in-out cursor-pointer',
          {
            '!bg-primary': isChecked,
          },
          className,
        )}
      >
        <div
          className={classNames('bg-white w-[16px] h-[16px] rounded-full shadow-md duration-300 ease-in-out', {
            'translate-x-4': isChecked,
          })}
        ></div>
      </label>
    </div>
  );
});

export default Switch;
