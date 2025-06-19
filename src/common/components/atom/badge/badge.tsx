import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import InfoIcon from '../../icons/info';
import Modal from '../modal';
import Text from '../text/text';

interface BadgeProps {
  text: string | React.ReactNode;
  icon?: React.ReactNode;
  fontSize?: 'base' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  fontWeight?: 'bold' | 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'extraBold' | 'black';
  className?: string;
  parentClassName?: string;
  caption?: string;
  hint?: string;
}

export const Badge = (props: BadgeProps) => {
  const { text, icon, fontSize, fontWeight, className, parentClassName, caption, hint } = props;

  const { handleOpen, modalProps } = useModal();

  return (
    <div className="flex items-center justify-center space-s-2">
      <div
        onClick={hint ? handleOpen : undefined}
        className={classNames(
          'flex items-center justify-center gap-1 bg-current text-white py-1 px-3 rounded-3xl',
          { 'cursor-help': hint },
          parentClassName,
        )}
      >
        {icon && <span>{icon}</span>}
        <Text fontSize={fontSize} fontWeight={fontWeight} className={className}>
          {text}
        </Text>
        {hint && <InfoIcon className="w-5 h-5 -ml-1" />}
      </div>
      {caption && (
        <div className="space-s-1">
          <Text fontSize="sm" fontWeight="medium">
            {caption}
          </Text>
        </div>
      )}
      <Modal noHeader {...modalProps}>
        <Text dangerouslySetInnerHTML={{ __html: hint ?? '' }} />
      </Modal>
    </div>
  );
};

export default Badge;
