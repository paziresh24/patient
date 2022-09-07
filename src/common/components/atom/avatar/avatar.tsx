import { randomColor } from '@/common/utils/randomColor';
import clsx from 'clsx';
import { ImgHTMLAttributes } from 'react';
import Text from '../text';

/* eslint-disable @next/next/no-img-element */
interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Src of the image
   * if not provided, the avatar will be a placeholder
   */
  src?: string;
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
}

export const Avatar: React.FC<AvatarProps> = props => {
  const { src, width = 70, height = 70, className, name } = props;

  return src ? (
    <img
      src={src}
      alt="avatar"
      width={width}
      height={height}
      style={{ minWidth: width, height }}
      className={clsx('rounded-full bg-gray', className)}
      loading="lazy"
    />
  ) : (
    <div
      style={{ width, height, ...(name?.trim() && { backgroundColor: randomColor(name ?? '') }) }}
      className={clsx('rounded-full flex justify-center items-center bg-gray', className)}
    >
      {name?.trim() && (
        <Text className="text-white" fontWeight="bold">
          {name.split(' ')[0]?.slice(0, 1) ?? ''} {name.split(' ')[1]?.slice(0, 1) ?? ''}
        </Text>
      )}
    </div>
  );
};

export default Avatar;
