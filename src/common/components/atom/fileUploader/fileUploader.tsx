import clsx from 'clsx';
import { ForwardedRef, forwardRef, InputHTMLAttributes, useRef } from 'react';
import Text from '../text';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

interface FileProps extends InputProps {
  lable: string;
  classNameWrapper?: string;
}

const FileUploader = forwardRef((props: FileProps, ref: ForwardedRef<any>) => {
  const { lable, className, classNameWrapper, onSelect, ...inputProps } = props;
  const inputRef = useRef<any>(null);

  return (
    <>
      <div
        className={clsx(
          'w-full h-[4rem] rounded-lg flex cursor-pointer justify-center items-center bg-[#f8fafb] border !border-solid border-slate-300',
          classNameWrapper,
        )}
        onClick={() => inputRef.current.click()}
      >
        <Text fontSize="sm" fontWeight="medium" className="text-black">
          {lable}
        </Text>
        <input ref={inputRef} type="file" {...inputProps} className="hidden" />
      </div>
    </>
  );
});

export default FileUploader;
