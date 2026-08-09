import classNames from '@/common/utils/classNames';
import { PhotoProvider, PhotoView } from 'react-photo-view';

interface GalleryProps {
  items: string[];
  className?: string;
  /** Accessible image label prefix; defaults to gallery photo wording. */
  imageAltPrefix?: string;
}

export const Gallery = (props: GalleryProps) => {
  const { items, className, imageAltPrefix = 'تصویر گالری پزشک' } = props;

  return (
    <div className={classNames('p-4 pb-3', className)}>
      <PhotoProvider>
        <div className="flex pb-1 overflow-auto rounded-lg space-s-3">
          {items.map((item, index) => (
            <PhotoView key={index} src={item + '?size=100'}>
              <img
                key={item}
                src={item}
                width={120}
                height={120}
                alt={`${imageAltPrefix} ${index + 1}`}
                className="rounded-md cursor-pointer max-h-40 object-cover"
              />
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default Gallery;
