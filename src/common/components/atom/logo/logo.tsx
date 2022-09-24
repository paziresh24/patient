/* eslint-disable @next/next/no-img-element */
import Text from '@/components/atom/text';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import logoSvg from './logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = props => {
  const { width, height, fontSize, className } = props;
  const { t } = useTranslation('common');
  return (
    <div className="flex items-center gap-2">
      <img src={logoSvg.src} alt="پذیرش 24" width={width || 60} height={height || 60} />
      <Text className={clsx('text-brand', className)} fontSize={fontSize} fontWeight="black">
        {t('brandName')}
      </Text>
    </div>
  );
};

export default Logo;
