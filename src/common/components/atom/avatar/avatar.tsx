/* eslint-disable @next/next/no-img-element */
interface AvatarProps {
  /**
   * Src of the image
   * if not provided, the avatar will be a placeholder
   */
  src: string;
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
}

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { src, width = 70, height = 70 } = props;

  return (
    <img
      src={src}
      alt="avatar"
      width={width}
      height={height}
      style={{ minWidth: width, height }}
      className="rounded-full bg-gray"
    />
  );
};

export default Avatar;
