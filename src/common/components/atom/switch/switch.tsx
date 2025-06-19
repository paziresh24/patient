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
          'w-[54px] h-[30px] flex items-center bg-slate-200 rounded-full p-[4px] duration-300 ease-in-out cursor-pointer',
          {
            '!bg-primary': isChecked,
          },
          className,
        )}
      >
        <div
          className={classNames('bg-white w-[22px] h-[22px] rounded-full shadow-md duration-300 ease-in-out', {
            '-translate-x-6': isChecked,
          })}
        ></div>
      </label>
    </div>
  );
});

export default Switch;
