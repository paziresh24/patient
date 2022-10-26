import clsx from 'clsx';
import { ForwardedRef, forwardRef, InputHTMLAttributes, useEffect, useState } from 'react';

export type SwitchProps = InputHTMLAttributes<HTMLInputElement>;
// eslint-disable-next-line react/display-name
export const Switch = forwardRef((props: SwitchProps, ref: ForwardedRef<any>) => {
  const { className, onChange, ...checkBoxProps } = props;
  const [isChecked, setIsChecked] = useState(checkBoxProps.defaultChecked);

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
      ></input>
      <div
        onClick={() => setIsChecked(prev => !prev)}
        className={clsx('w-[54px] h-[30px] flex items-center bg-slate-200 rounded-full p-[4px] duration-300 ease-in-out cursor-pointer', {
          '!bg-primary': isChecked,
        })}
      >
        <div
          className={clsx('bg-white w-[22px] h-[22px] rounded-full shadow-md duration-300 ease-in-out', {
            '-translate-x-6': isChecked,
          })}
        ></div>
      </div>
    </div>
  );
});

export default Switch;
