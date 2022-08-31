import Text from '@/components/atom/text';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = props => {
  const { width, height } = props;
  return (
    <div className="flex items-center gap-2">
      <Image src="/image/logo.svg" alt="پذیرش 24" width={width || 60} height={height || 60} />
      <Text className="text-brand" fontSize="xl" fontWeight="black">
        پذیرش 24
      </Text>
    </div>
  );
};

export default Logo;
