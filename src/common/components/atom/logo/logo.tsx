import Text from '@/components/atom/text';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import logoSvg from './logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  className?: string;
  type?: 'default' | 'compact';
}

export const Logo: React.FC<LogoProps> = props => {
  const { width, height, fontSize, className, type = 'default' } = props;
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center space-s-2">
      <Image src={logoSvg.src} alt="پذیرش 24" width={width || 60} height={height || 60} priority />
      {type === 'default' && (
        <Text className={clsx('text-brand', className)} fontSize={fontSize} fontWeight="black">
          {t('brandName')}
        </Text>
      )}
    </div>
  );
};

export default Logo;
