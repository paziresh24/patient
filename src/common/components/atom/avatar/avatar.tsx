import { randomColor } from '@/common/utils/randomColor';
import clsx from 'clsx';
import { ImageProps } from 'next/future/image';
import Text from '../text';

/* eslint-disable @next/next/no-img-element */
interface AvatarProps extends Omit<ImageProps, 'alt'> {
  /**
   * Width of the image in pixels
   * @default 70
   */
  width?: number;
  /**
   * Height of the image in pixels
   * @default 70
   */
  height?: number;
  /**
   * name of the user for placeholder when user don't have image
   */
  name?: string;
  as?: any;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = props => {
  const { src, width = 70, height = 70, className, name, as = 'img', alt = 'avatar', ...rest } = props;

  const Component = as;

  return src ? (
    <Component
      width={width}
      height={height}
      alt={alt}
      style={{ minWidth: width, height }}
      className={clsx('rounded-full bg-gray', className)}
      {...rest}
    />
  ) : (
    <div
      style={{ width, height, ...(name?.trim() && { backgroundColor: randomColor(name ?? '') }) }}
      className={clsx('rounded-full flex justify-center items-center bg-gray', className)}
    >
      {name?.trim() && (
        <Text className="text-white tracking-tighter" fontWeight="medium">
          {name.split(' ')[0]?.slice(0, 1) ?? ''} {name.split(' ')[1]?.slice(0, 1) ?? ''}
        </Text>
      )}
    </div>
  );
};

export default Avatar;
