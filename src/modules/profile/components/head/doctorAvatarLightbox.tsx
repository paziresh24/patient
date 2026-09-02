import CloseIcon from '@/common/components/icons/close';
import { PhotoSlider } from 'react-photo-view';

type DoctorAvatarLightboxProps = {
  src: string;
  visible: boolean;
  onClose: () => void;
  displayName?: string;
};

export function DoctorAvatarLightbox({ src, visible, onClose, displayName }: DoctorAvatarLightboxProps) {
  return (
    <PhotoSlider
      className="PhotoView--doctor-avatar"
      images={[{ key: src, src }]}
      visible={visible}
      index={0}
      onIndexChange={() => undefined}
      onClose={onClose}
      maskOpacity={0.9}
      photoClosable
      pullClosable
      maskClosable
      bannerVisible={false}
      overlayRender={({ onClose: close }) => (
        <>
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              close(event);
            }}
            aria-label="بستن"
            className="pointer-events-auto absolute end-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white shadow-md ring-1 ring-white/30 backdrop-blur-sm touch-manipulation"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
          {displayName?.trim() ? (
            <div
              dir="rtl"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-[max(2.75rem,env(safe-area-inset-bottom))] pt-20"
            >
              <span className="max-w-[min(90vw,28rem)] truncate text-center text-base font-medium tracking-tight text-white drop-shadow-sm">
                {displayName}
              </span>
            </div>
          ) : null}
        </>
      )}
    />
  );
}

export default DoctorAvatarLightbox;
