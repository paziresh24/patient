/* eslint-disable react/display-name */
import { CodeComponentMeta } from '@plasmicapp/host';
import React from 'react';
import classNames from '@/common/utils/classNames';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';

interface GalleryProps {
  items: string[];
  className?: string;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const Gallery = (props: GalleryProps) => {
  const { items = [], className, imageClassName, imageWidth = 120, imageHeight = 120 } = props;

  return (
    <PhotoProvider>
      <div className={classNames('flex pb-1 overflow-auto gap-3', className)}>
        {items.map((item, index) => (
          <PhotoView key={index} src={item ? (item?.includes('?') ? item : item + '?size=100') : ''}>
            <Image
              key={item}
              src={item}
              width={imageWidth}
              height={imageHeight}
              alt=""
              className={classNames('rounded-md cursor-pointer', imageClassName)}
            />
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};

export const galleryMeta: CodeComponentMeta<GalleryProps> = {
  name: 'Gallery',
  displayName: 'Paizresh24/Gallery',
  importPath: '@/common/fragment/components/gallery',
  figmaMappings: [{ figmaComponentName: 'Gallery' }],
  props: {
    items: {
      type: 'array',
      defaultValue: [],
    },
    className: 'string',
    imageClassName: 'string',
    imageWidth: {
      type: 'number',
      defaultValue: 120,
    },
    imageHeight: {
      type: 'number',
      defaultValue: 120,
    },
  },
  classNameProp: 'className',
};
