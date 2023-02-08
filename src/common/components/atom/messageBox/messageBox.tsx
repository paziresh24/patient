import clsx from 'clsx';
import { InputHTMLAttributes, useRef } from 'react';
import Loading from '../loading/loading';
import Text from '../text/text';

interface MessageBoxProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  submitText?: string;
  submitHandled?: () => void;
  isLoading?: boolean;
  height?: string;
}

export const MessageBox = (props: MessageBoxProps) => {
  const { height = '2.5rem', submitText, submitHandled, isLoading = false, className, ...inputProps } = props;
  const ref = useRef<any>();

  const inputHandled = () => {
    const element = ref.current;
    element.style.height = height;
    element.style.height = element.scrollHeight + 'px';
  };

  return (
    <>
      <div
        className={clsx(
          'h-full flex w-full bg-transparent text-sm md:text-base appearance-none p-[0.1rem] border !border-slate-300 items-center rounded-lg placeholder:text-sm border-1',
          { 'bg-slate-200 opacity-50 pointer-events-none': isLoading },
          className,
        )}
      >
        {isLoading && <Loading className="absolute w-full" />}
        <textarea
          ref={ref}
          style={{ height: height }}
          className="w-full p-2 outline-none placeholder:text-sm resize-none bg-transparent placeholder:pt-[0.1rem] text-sm"
          {...inputProps}
          onInput={inputHandled}
        />
        {submitText && (
          <Text onClick={submitHandled} fontSize="sm" className="ml-2 text-[#0077db] cursor-pointer">
            {submitText}
          </Text>
        )}
      </div>
    </>
  );
};
export default MessageBox;
