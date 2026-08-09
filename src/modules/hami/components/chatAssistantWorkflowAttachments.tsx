import classNames from '@/common/utils/classNames';
import ClientOnlyPortal from '@/common/components/layouts/clientOnlyPortal';
import ChevronIcon from '@/common/components/icons/chevron';
import CloseIcon from '@/common/components/icons/close';
import { detectTextDirection, getTextDirectionClass } from '@/common/utils/detectTextDirection';
import { VardastWorkflowAttachment } from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { vardastType } from '@/modules/hami/components/chatAssistantTypography';
import { useEffect, useState } from 'react';

export const isImageAttachment = (attachment: VardastWorkflowAttachment) =>
  attachment.content_type?.toLowerCase().startsWith('image/') ||
  /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(attachment.url);

export const getAttachmentName = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    const lastPart = pathname.split('/').pop();
    return decodeURIComponent(lastPart || 'file');
  } catch {
    return 'file';
  }
};

interface ChatAssistantWorkflowAttachmentsProps {
  imageAttachments: VardastWorkflowAttachment[];
  fileAttachments: VardastWorkflowAttachment[];
}

export const ChatAssistantWorkflowAttachments = ({
  imageAttachments,
  fileAttachments,
}: ChatAssistantWorkflowAttachmentsProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const activeImage = activeImageIndex !== null ? imageAttachments[activeImageIndex] : null;
  const hasPreviousImage = activeImageIndex !== null && activeImageIndex > 0;
  const hasNextImage = activeImageIndex !== null && activeImageIndex < imageAttachments.length - 1;

  useEffect(() => {
    if (activeImageIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImageIndex]);

  if (!imageAttachments.length && !fileAttachments.length) return null;

  return (
    <>
      {!!imageAttachments.length && (
        <div className="mt-3 space-y-2">
          {imageAttachments.map((attachment, index) => {
            const label = attachment.section || 'تصویر پیوست';
            const direction = detectTextDirection(label);

            return (
            <button
              key={`${attachment.url}-${index}`}
              type="button"
              dir={direction}
              onClick={() => setActiveImageIndex(index)}
              className="flex w-full items-center gap-3 rounded-xl bg-white/50 p-2 ring-1 ring-slate-900/[0.06] transition active:scale-[0.99] active:bg-white/70"
            >
              <img
                src={attachment.url}
                alt={label}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p
                  dir={direction}
                  className={classNames(vardastType.caption, 'line-clamp-2 text-slate-600', getTextDirectionClass(direction))}
                >
                  {label}
                </p>
                {imageAttachments.length > 1 && (
                  <p dir="rtl" className="mt-0.5 text-right text-[10px] text-slate-400">برای مشاهده بزنید</p>
                )}
              </div>
            </button>
            );
          })}
        </div>
      )}

      {!!fileAttachments.length && (
        <div className={classNames('space-y-2', imageAttachments.length ? 'mt-2' : 'mt-3')}>
          {fileAttachments.map((attachment, index) => {
            const label = attachment.section || getAttachmentName(attachment.url);
            const direction = detectTextDirection(label);

            return (
            <a
              key={`${attachment.url}-${index}`}
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              dir={direction}
              className="flex items-center gap-3 rounded-xl bg-white/50 p-2.5 ring-1 ring-slate-900/[0.06] transition active:bg-white/70"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold uppercase text-primary">
                {getAttachmentName(attachment.url).split('.').pop()?.slice(0, 4) || 'file'}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  dir={direction}
                  className={classNames(vardastType.caption, 'line-clamp-2 text-slate-600', getTextDirectionClass(direction))}
                >
                  {label}
                </p>
                <p dir="rtl" className="mt-0.5 text-right text-[10px] text-primary">دانلود فایل</p>
              </div>
            </a>
            );
          })}
        </div>
      )}

      {activeImage && (
        <ClientOnlyPortal selector="body">
          <div
            className="fixed inset-0 z-infinity bg-black"
            onClick={() => setActiveImageIndex(null)}
          >
            <div className="relative flex h-[100dvh] w-[100dvw] flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
                <span className="text-xs text-white/70">
                  {activeImageIndex! + 1} از {imageAttachments.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition active:scale-95 active:bg-white/10"
                  aria-label="بستن"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-2">
                {hasNextImage && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(prev => (prev === null ? 0 : prev + 1))}
                    className="absolute left-2 z-10 rounded-full p-2 text-white/80 transition active:bg-white/10"
                    aria-label="تصویر بعدی"
                  >
                    <ChevronIcon dir="left" className="h-5 w-5" />
                  </button>
                )}

                <img
                  src={activeImage.url}
                  alt={activeImage.section || 'attachment'}
                  className="max-h-full max-w-full object-contain"
                />

                {hasPreviousImage && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(prev => (prev === null ? 0 : prev - 1))}
                    className="absolute right-2 z-10 rounded-full p-2 text-white/80 transition active:bg-white/10"
                    aria-label="تصویر قبلی"
                  >
                    <ChevronIcon dir="right" className="h-5 w-5" />
                  </button>
                )}
              </div>

              {activeImage.section && (() => {
                const direction = detectTextDirection(activeImage.section);

                return (
                <div className="shrink-0 px-5 pb-8 pt-4">
                  <p
                    dir={direction}
                    className={classNames('text-sm leading-7 text-white/90 whitespace-pre-wrap', getTextDirectionClass(direction))}
                  >
                    {activeImage.section}
                  </p>
                </div>
                );
              })()}
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
};

export default ChatAssistantWorkflowAttachments;
