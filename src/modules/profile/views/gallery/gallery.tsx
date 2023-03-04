import classNames from '@/common/utils/classNames';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
interface GalleryProps {
  items: string[];
  className?: string;
}

export const Gallery = (props: GalleryProps) => {
  const { items, className } = props;

  return (
    <div className={classNames('p-4 pb-3', className)}>
      <PhotoProvider>
        <div className="flex pb-1 overflow-auto rounded-lg space-s-3">
          {items.map((item, index) => (
            <PhotoView key={index} src={item + '?size=100'}>
              <Image key={item} src={item} width={150} height={150} alt="" className="rounded-md cursor-pointer max-h-40" />
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default Gallery;
