import Copy from '@/common/components/atom/copy';
import Text from '@/common/components/atom/text/text';
import CopyIcon from '@/common/components/icons/copy';
import classNames from '@/common/utils/classNames';
import toast from 'react-hot-toast';
import { useCopyToClipboard } from 'react-use';

interface RowTextProps {
  title: string;
  value: string | any;
  className?: string;
  titleFontWeight: 'bold' | 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'extraBold' | 'black';
  titleFontSize: 'base' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  valueFontWeight: 'bold' | 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'extraBold' | 'black';
  valueFontSize: 'base' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  copyable?: boolean;
}

export const RowText = (props: RowTextProps) => {
  const { title, value, className, titleFontWeight, titleFontSize, valueFontWeight, valueFontSize, copyable } = props;
  const [, copyToClipboard] = useCopyToClipboard();

  return (
    <div className={classNames('flex items-center justify-between space-s-3', className)}>
      <Text className="whitespace-nowrap" fontWeight={titleFontWeight} fontSize={titleFontSize}>
        {title}
      </Text>

      {copyable ? (
        <Copy
          value={value}
          onCopied={() =>
            toast('کپی شد.', {
              position: 'top-center',
              className: '!bg-black !p-2 !text-white',
              duration: 1000,
            })
          }
        >
          <Text fontWeight={valueFontWeight} fontSize={valueFontSize}>
            {value}
          </Text>
        </Copy>
      ) : (
        <Text
          fontWeight={valueFontWeight}
          fontSize={valueFontSize}
          className={classNames('flex items-center gap-1', {
            'cursor-pointer': copyable,
          })}
          onClick={() => copyable && copyToClipboard(value)}
        >
          {copyable && <CopyIcon width={18} height={18} className="opacity-60" />}
          {value}
        </Text>
      )}
    </div>
  );
};

export default RowText;
