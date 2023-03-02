import classNames from '@/common/utils/classNames';
import Text from '../text/text';

interface BadgeProps {
  text: string;
  icon?: React.ReactNode;
  fontSize?: 'base' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  fontWeight?: 'bold' | 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'extraBold' | 'black';
  className?: string;
  parentClassName?: string;
  caption?: string;
}

export const Badge = (props: BadgeProps) => {
  const { text, icon, fontSize, fontWeight, className, parentClassName, caption } = props;
  return (
    <div className="flex items-center justify-center space-s-2">
      <div className={classNames('flex items-center justify-center gap-1 bg-current text-white py-1 px-3 rounded-3xl', parentClassName)}>
        {icon && <span>{icon}</span>}
        <Text fontSize={fontSize} fontWeight={fontWeight} className={className}>
          {text}
        </Text>
      </div>
      {caption && (
        <div className="space-s-1">
          <Text fontSize="sm" fontWeight="medium">
            {caption}
          </Text>
        </div>
      )}
    </div>
  );
};

export default Badge;
