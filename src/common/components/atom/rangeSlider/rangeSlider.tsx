import { ChangeEvent, ForwardedRef, forwardRef, InputHTMLAttributes, useEffect, useRef, useState } from 'react';

export interface RangeSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onChange: (value: [number, number]) => void;
  value: [number, number];
}
// eslint-disable-next-line react/display-name
export const RangeSlider = forwardRef((props: RangeSliderProps, ref: ForwardedRef<any>) => {
  const { min, max, step, onChange, value, ...rest } = props;
  const [minValue, setMinValue] = useState(value?.[0] ?? 0);
  const [maxValue, setMaxValue] = useState(value?.[1] ?? +max!);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleMax = (e: ChangeEvent<HTMLInputElement>) => {
    if (maxValue - minValue >= 0 && maxValue <= +max!) {
      if (parseInt(e.target.value) > minValue) {
        setMaxValue(parseInt(e.target.value));
        onChange && onChange([minValue, parseInt(e.target.value)]);
      }
    } else {
      if (parseInt(e.target.value) > maxValue) {
        setMaxValue(parseInt(e.target.value));
        onChange && onChange([minValue, parseInt(e.target.value)]);
      }
    }
  };
  const handleMin = (e: ChangeEvent<HTMLInputElement>) => {
    if (maxValue - minValue >= 0 && maxValue <= +max!) {
      if (parseInt(e.target.value) < maxValue) {
        setMinValue(parseInt(e.target.value));
        onChange && onChange([parseInt(e.target.value), maxValue]);
      }
    } else {
      if (parseInt(e.target.value) < minValue) {
        setMinValue(parseInt(e.target.value));
        onChange && onChange([parseInt(e.target.value), maxValue]);
      }
    }
  };

  useEffect(() => {
    setMinValue(value?.[0] ?? 0);
    setMaxValue(value?.[1] ?? +max!);
  }, [value]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.left = (+minValue - +min!) * 3 + '%';
      progressRef.current.style.right = (+max! - maxValue) * 3.2 + '%';
    }
  }, [minValue, maxValue, max, step]);

  return (
    <div className="relative flex h-2 rounded-full select-none bg-slate-200">
      <div className="absolute h-2 rounded bg-primary" ref={progressRef} />
      <input
        type="range"
        name=""
        onChange={handleMin}
        value={minValue}
        min={min}
        step={step}
        max={max}
        className="absolute w-full bg-transparent outline-none appearance-none pointer-events-none -top-[0.35rem]"
        {...rest}
      />
      <input
        type="range"
        name=""
        onChange={handleMax}
        value={maxValue}
        min={min}
        step={step}
        max={max}
        className="absolute w-full bg-transparent outline-none appearance-none pointer-events-none -top-[0.35rem]"
        {...rest}
      />
    </div>
  );
});

export default RangeSlider;
