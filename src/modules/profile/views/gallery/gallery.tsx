import clsx from 'clsx';
import FsLightbox from 'fslightbox-react';
import { useState } from 'react';

interface GalleryProps {
  items: string[];
  className?: string;
}

export const Gallery = (props: GalleryProps) => {
  const { items, className } = props;
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  });

  const openLightboxOnSlide = (number: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number,
    });
  };

  return (
    <div className={clsx('p-4 pb-3', className)}>
      <div className="flex pb-1 overflow-auto rounded-lg space-s-3">
        {items.map((item, index) => (
          <img key={item} onClick={() => openLightboxOnSlide(index + 1)} src={item} alt="" className="rounded-md cursor-pointer" />
        ))}
      </div>
      <div style={{ direction: 'ltr' }}>
        <FsLightbox toggler={lightboxController.toggler} sources={items.map(item => `${item}?size=100`)} slide={lightboxController.slide} />
      </div>
    </div>
  );
};

export default Gallery;
