import { InputHTMLAttributes, useRef } from 'react';
import Text from '../text/text';

interface MessageBoxProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  submitText?: string;
  submitHandled?: (value: string) => void;
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
      <div className="relative flex items-center">
        <textarea
          ref={ref}
          style={{ height: height }}
          className="h-full p-2 pl-14 px-3 no-scroll placeholder:text-sm resize-none bg-transparent placeholder:pt-[0.1rem] text-sm flex w-full focus:outline-primary md:text-base appearance-none border !border-slate-300 items-center rounded-lg"
          {...inputProps}
          onInput={inputHandled}
        />
        {submitText && (
          <Text
            onClick={() => {
              submitHandled && submitHandled(ref.current.value! ?? '');
            }}
            fontSize="sm"
            fontWeight="medium"
            className="ml-3 text-[#0077db] cursor-pointer absolute left-0"
          >
            {submitText}
          </Text>
        )}
      </div>
    </>
  );
};
export default MessageBox;
