/* eslint-disable @next/next/no-img-element */
import Text from '@/components/atom/text';
import logoSvg from './logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
}

export const Logo: React.FC<LogoProps> = props => {
  const { width, height, fontSize } = props;

  return (
    <div className="flex items-center gap-2">
      <img src={logoSvg.src} alt="پذیرش 24" width={width || 60} height={height || 60} />
      <Text className="text-brand" fontSize={fontSize} fontWeight="black">
        پذیرش 24
      </Text>
    </div>
  );
};

export default Logo;
