/* eslint-disable react/display-name */
import { CodeComponentMeta } from '@plasmicapp/host';
import React, { useCallback, useMemo, useState } from 'react';
import classNames from '@/common/utils/classNames';
import Image from 'next/image';
import { PhotoProvider, PhotoSlider, PhotoView } from 'react-photo-view';

interface GalleryProps {
  items: string[];
  className?: string;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  eagerFirst?: boolean;
  /** Widget-profile phone-strip gallery + lightbox (plain <img>). Opt-in only. */
  naturalSizing?: boolean;
  /** Accessible image label prefix. */
  imageAltPrefix?: string;
}

function normalizeItems(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        if (typeof record.url === 'string') return record.url;
        if (typeof record.src === 'string') return record.src;
        if (typeof record.image === 'string') return record.image;
      }
      return '';
    })
    .filter(Boolean);
}

function photoSrc(item: string) {
  return item ? (item.includes('?') ? item : `${item}?size=100`) : '';
}

/** Max phone thumbs shown; overflow opens in lightbox via +N on the last frame. */
const PHONE_PREVIEW_MAX = 3;

/**
 * Compact App Store–style phone strip — widget profile only.
 *
 * Thumb strip keeps natural API order (no reverse). Under html[dir=rtl], flex puts
 * the first screenshot on the right.
 *
 * Lightbox only: images are passed to PhotoSlider in reverse so LTR engine math
 * still works, but “next” slides in from the left (RTL feel). Thumb clicks map
 * apiIndex → reversed lightbox index.
 */
function PhoneStripGallery({
  items,
  className,
  imageClassName,
  eagerFirst = true,
  imageAltPrefix = 'تصویر گالری',
}: {
  items: string[];
  className?: string;
  imageClassName?: string;
  eagerFirst?: boolean;
  imageAltPrefix?: string;
}) {
  const visibleCount = Math.min(items.length, PHONE_PREVIEW_MAX);
  const previewItems = items.slice(0, visibleCount);
  const remaining = items.length - visibleCount;

  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Reverse only for the lightbox — next (API forward) uses PhotoView prev-slide (from left).
  const lightboxImages = useMemo(
    () =>
      [...items].reverse().map((src, i) => ({
        key: `${src || 'img'}-${i}`,
        src: photoSrc(src),
      })),
    [items],
  );

  const openLightboxAt = useCallback(
    (apiIndex: number) => {
      if (!items.length) return;
      setLightboxIndex(items.length - 1 - apiIndex);
      setLightboxVisible(true);
    },
    [items.length],
  );

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false);
  }, []);

  return (
    <>
      <div className={classNames('w-full', className)}>
        <div
          data-widget-gallery-strip="api-order"
          className="-mx-0.5 flex flex-row gap-2.5 overflow-x-auto px-0.5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {previewItems.map((item, apiIndex) => {
            const isEager = eagerFirst && apiIndex === 0;
            // +N on the last visible thumb (leftmost under rtl flex)
            const showMoreOverlay = remaining > 0 && apiIndex === visibleCount - 1;
            return (
              <div
                key={item || apiIndex}
                role="button"
                tabIndex={0}
                onClick={() => openLightboxAt(apiIndex)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightboxAt(apiIndex);
                  }
                }}
                className="relative h-40 w-[5.625rem] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
              >
                <img
                  src={item}
                  alt={`${imageAltPrefix} ${apiIndex + 1}`}
                  fetchPriority={isEager ? 'high' : 'auto'}
                  loading={isEager ? 'eager' : 'lazy'}
                  className={classNames(
                    'pointer-events-none h-full w-full object-cover object-top',
                    imageClassName,
                  )}
                />
                {showMoreOverlay && (
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/50"
                    aria-hidden
                  >
                    <span className="text-lg font-semibold text-white" dir="ltr">
                      +{remaining}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <PhotoSlider
        className="PhotoView--widget-rtl"
        images={lightboxImages}
        visible={lightboxVisible}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={closeLightbox}
        toolbarRender={({ index, images }) => (
          // Remap reverse-list index back to API order for the counter (1 = first screenshot).
          <span className="PhotoView-widget-rtl-counter" dir="ltr">
            {images.length - index} / {images.length}
          </span>
        )}
      />
    </>
  );
}

export const Gallery = (props: GalleryProps) => {
  const {
    className,
    imageClassName,
    imageWidth = 120,
    imageHeight = 120,
    eagerFirst = true,
    naturalSizing = false,
    imageAltPrefix = 'تصویر گالری پزشک',
  } = props;

  const items = normalizeItems(props.items);

  if (naturalSizing) {
    return (
      <PhoneStripGallery
        items={items}
        className={className}
        imageClassName={imageClassName}
        eagerFirst={eagerFirst}
        imageAltPrefix={imageAltPrefix}
      />
    );
  }

  return (
    <PhotoProvider>
      <div className={classNames('flex gap-3 overflow-auto pb-1', className)}>
        {items.map((item, index) => (
          <PhotoView key={index} src={photoSrc(item)}>
            {(() => {
              const isEager = eagerFirst && index === 0;
              return (
                <Image
                  key={item}
                  src={item}
                  fetchPriority={isEager ? 'high' : 'auto'}
                  width={imageWidth}
                  height={imageHeight}
                  alt={`${imageAltPrefix} ${index + 1}`}
                  className={classNames('cursor-pointer rounded-md', imageClassName)}
                  priority={isEager}
                  loading={isEager ? 'eager' : 'lazy'}
                />
              );
            })()}
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};

/** Widget-profile gallery: compact phone-strip preview; full set in lightbox. */
export const WidgetProfileGallery = (props: GalleryProps) => (
  <Gallery {...props} naturalSizing />
);

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
    eagerFirst: {
      type: 'boolean',
      defaultValue: false,
    },
    naturalSizing: {
      type: 'boolean',
      defaultValue: false,
    },
    imageAltPrefix: {
      type: 'string',
      defaultValue: 'تصویر گالری پزشک',
    },
  },
  classNameProp: 'className',
};
