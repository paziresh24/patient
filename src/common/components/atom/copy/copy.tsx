import classNames from '@/common/utils/classNames';
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import CopyIcon from '../../icons/copy';
import CopySuccessIcon from '../../icons/copySuccess';

interface CopyProps extends HTMLAttributes<HTMLHRElement> {
  children?: ReactNode;
  value: string;
  onCopied?: () => void;
}

export const Copy = (props: CopyProps) => {
  const { value, className, children, onCopied, ...rest } = props;
  const [, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const copyInterval = useRef<any>(null);

  useEffect(() => {
    if (isCopied) {
      copyInterval.current = setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
    return () => clearTimeout(copyInterval.current);
  }, [isCopied]);

  return (
    <div
      className={classNames('flex space-s-1 cursor-pointer', className)}
      onClick={() => {
        copyToClipboard(value);
        setIsCopied(true);
        onCopied?.();
      }}
      {...rest}
    >
      <div>{children}</div>
      {!isCopied && <CopyIcon width={20} height={20} className="opacity-60" />}
      {isCopied && <CopySuccessIcon width={20} height={20} className="text-green-600" />}
    </div>
  );
};

export default Copy;
