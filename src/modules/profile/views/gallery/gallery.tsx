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
    <div className={classNames('p-4 md:p-5', className)}>
      <PhotoProvider>
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => (
            <PhotoView key={index} src={item + '?size=100'}>
              <div className="relative h-28 w-28 shrink-0 snap-start overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02] md:h-32 md:w-32">
                <Image src={item} fill alt="" sizes="128px" className="cursor-pointer object-cover" />
              </div>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default Gallery;
