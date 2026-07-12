import classNames from '@/common/utils/classNames';
import { isPicUserImageUrl } from '@/common/utils/picUserImageUrl';
import { randomColor } from '@/common/utils/randomColor';
import { ImageProps } from 'next/image';
import { useState } from 'react';
import Text from '../text';

/* eslint-disable @next/next/no-img-element */
interface AvatarProps extends Omit<ImageProps, 'alt' | 'src'> {
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
  src?: string;
}

export const Avatar: React.FC<AvatarProps> = props => {
  const { src, width = 70, height = 70, className, name, as = 'img', alt = 'avatar', ...rest } = props;
  const [hasError, setHasError] = useState(false);

  const Component = as;
  const usePicImageFit = isPicUserImageUrl(src);
  const showImage = Boolean(src) && !hasError;

  if (!showImage) {
    return (
      <div
        style={{ width, height, minWidth: width, ...(name?.trim() && { backgroundColor: randomColor(name ?? '') }) }}
        className={classNames('flex items-center justify-center rounded-full bg-gray', className)}
      >
        {name?.trim() && (
          <Text className="tracking-tighter text-white" fontWeight="medium">
            {name.split(' ')[0]?.slice(0, 1) ?? ''} {name.split(' ')[1]?.slice(0, 1) ?? ''}
          </Text>
        )}
      </div>
    );
  }

  return (
    <Component
      width={width}
      height={height}
      fetchpriority="high"
      loading="eager"
      decoding="sync"
      alt={alt}
      onError={() => setHasError(true)}
      style={{
        minWidth: width,
        width,
        height,
        ...(usePicImageFit && { objectFit: 'cover' }),
      }}
      className={classNames('rounded-full bg-gray', usePicImageFit && 'object-cover', className)}
      src={src}
      {...rest}
    />
  );
};

export default Avatar;
